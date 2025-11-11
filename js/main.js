import { initStartMenu } from './start_menu.js';
import { initMusicPlayer } from './music_player.js';
import { initTaskbar } from './taskbar.js';
import { initCalendar } from './calendar.js';



import { createNewTerminalWindow } from './new_terminal.js';

const desktop = document.getElementById('desktop');
const taskbarAppsContainer = document.querySelector('.taskbar-apps');

let zIndexCounter = 1;
let openWindows = {};

let isDragging = false;
let isResizing = false;
let draggedWindow = null;
let resizedWindow = null;
let offsetX, offsetY;
let originalX, originalY, originalWidth, originalHeight;
let resizeDirection = '';

// Use document instead of desktop for drag/resize to work in overlay mode
document.addEventListener('mousemove', (e) => {
    if (isDragging && draggedWindow) {
        draggedWindow.style.left = `${e.clientX - offsetX}px`;
        draggedWindow.style.top = `${e.clientY - offsetY}px`;
    } else if (isResizing && resizedWindow) {
        const dx = e.clientX - originalX;
        const dy = e.clientY - originalY;

        if (resizeDirection.includes('bottom')) {
            resizedWindow.style.height = `${originalHeight + dy}px`;
        }
        if (resizeDirection.includes('right')) {
            resizedWindow.style.width = `${originalWidth + dx}px`;
        }
        if (resizeDirection.includes('top')) {
            resizedWindow.style.height = `${originalHeight - dy}px`;
            resizedWindow.style.top = `${originalY + dy}px`;
        }
        if (resizeDirection.includes('left')) {
            resizedWindow.style.width = `${originalWidth - dx}px`;
            resizedWindow.style.left = `${originalX + dx}px`;
        }
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging && draggedWindow) {
        const titleBar = draggedWindow.querySelector('.draggable-title-bar');
        if(titleBar) titleBar.style.cursor = 'grab';

        if (draggedWindow.id === 'window-terminal') {
            const position = {
                x: parseInt(draggedWindow.style.left, 10),
                y: parseInt(draggedWindow.style.top, 10)
            };
            localStorage.setItem('terminalPosition', JSON.stringify(position));
        }
    }
    isDragging = false;
    draggedWindow = null;

    isResizing = false;
    resizedWindow = null;
    resizeDirection = '';
    document.body.style.cursor = 'default';
    document.body.style.userSelect = ''; // Re-enable text selection
});

function setActiveWindow(windowId) {
    for (const id in openWindows) {
        if (openWindows.hasOwnProperty(id) && id !== 'active') {
            openWindows[id].button.classList.remove('active');
        }
    }

    if (windowId && openWindows[windowId]) {
        const { window, button } = openWindows[windowId];
        button.classList.add('active');
        window.style.zIndex = zIndexCounter++;
        openWindows.active = windowId;
    }
}

function createWindow(id, title, contentHTML, options = {}) {
    const { width = 400, height = 'auto', resizable = true, maximizable = true, customFrame = false, customClass = '' } = options;

    let x = options.x;
    let y = options.y;

    if (x === undefined || y === undefined) {
        const windowCount = Object.keys(openWindows).length;
        const offset = 30;
        x = 50 + (windowCount * offset);
        y = 50 + (windowCount * offset);

        // Boundary check to prevent windows from opening off-screen
        const desktopWidth = document.getElementById('desktop').offsetWidth;
        const estimatedHeight = height === 'auto' ? 200 : height; // Estimate height for 'auto'
        if ((x + width > desktopWidth) || (y + estimatedHeight > window.innerHeight)) {
            x = 50;
            y = 50;
        }
    }

    if (openWindows[id]) {
        const { window, button } = openWindows[id];
        if (window.style.display === 'none') {
            button.click();
        } else {
            setActiveWindow(id);
        }
        return window;
    }

    const windowElement = document.createElement('div');
    windowElement.classList.add('window');
    if (customFrame) windowElement.classList.add('custom-frame');
    if (customClass) windowElement.classList.add(customClass);
    windowElement.id = `window-${id}`;
    windowElement.style.width = `${width}px`;
    windowElement.style.height = Number.isInteger(height) ? `${height}px` : height;
    windowElement.style.left = `${x}px`;
    windowElement.style.top = `${y}px`;
    windowElement.style.display = customFrame ? 'block' : 'flex'; // Set initial display

    let finalContentHTML = '';
    if (customFrame) {
        finalContentHTML = contentHTML;
    } else {
        let maximizeButtonHTML = maximizable ? '<button class="maximize-button">&#9723;</button>' : '';
        finalContentHTML = `
            <div class="window-title-bar draggable-title-bar">
                <span>${title}</span>
                <div class="window-controls">
                    <button class="minimize-button">_</button>
                    ${maximizeButtonHTML}
                    <button class="close-button">X</button>
                </div>
            </div>
            <div class="window-content" style="padding: ${customClass.includes('terminal-container') ? '0px' : '10px'};">${contentHTML}</div>
        `;
    }
    windowElement.innerHTML = finalContentHTML;
    desktop.appendChild(windowElement);

    if (resizable) {
        const resizeHandles = [
            'top-left', 'top', 'top-right',
            'left', 'right',
            'bottom-left', 'bottom', 'bottom-right'
        ];
        resizeHandles.forEach(dir => {
            const handle = document.createElement('div');
            handle.classList.add('resize-handle', `resize-handle-${dir}`);
            handle.dataset.direction = dir;
            windowElement.appendChild(handle);

            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isResizing = true;
                resizedWindow = windowElement;
                resizeDirection = dir;
                originalX = e.clientX;
                originalY = e.clientY;
                const rect = resizedWindow.getBoundingClientRect();
                originalWidth = rect.width;
                originalHeight = rect.height;
            });
        });
    }

    const taskbarButton = document.createElement('button');
    taskbarButton.id = `taskbar-button-${id}`;
    taskbarButton.className = 'taskbar-app-button';
    taskbarButton.textContent = title;
    taskbarAppsContainer.appendChild(taskbarButton);

    openWindows[id] = { window: windowElement, button: taskbarButton };
    setActiveWindow(id);

    taskbarButton.addEventListener('click', () => {
        if (openWindows.active === id && windowElement.style.display !== 'none') {
            windowElement.style.display = 'none'; // Minimize
            openWindows.active = null;
            taskbarButton.classList.remove('active');
        } else {
            windowElement.style.display = customFrame ? 'block' : 'flex'; // Restore
            setActiveWindow(id);
        }
    });

    windowElement.addEventListener('mousedown', () => setActiveWindow(id));

    const titleBar = windowElement.querySelector('.draggable-title-bar');
    if (titleBar) {
        titleBar.addEventListener('mousedown', (e) => {
            if (e.target !== titleBar && e.target.parentElement !== titleBar) return;
            isDragging = true;
            draggedWindow = windowElement;
            offsetX = e.clientX - windowElement.getBoundingClientRect().left;
            offsetY = e.clientY - windowElement.getBoundingClientRect().top;
            titleBar.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none'; // Prevent text selection while dragging
        });
    }

    const closeButton = windowElement.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // Check if the closed window is the music player
            if (id === 'music-player') {
                // The music_player.js module handles its own audio stopping when its window is closed.
            }
            // Check if the closed window is the terminal with an active SSH session
            if (id === 'new-terminal' && window.sshOriginalEnvironment) {
                // Import necessary functions dynamically
                import('./terminal_filesystem.js').then(({ getDirectory, resetToInitialUser }) => {
                    import('./terminal_commands.js').then(({ environment }) => {
                        // Restore original /home directory contents
                        const homeDir = getDirectory('/home');
                        if (homeDir && window.sshOriginalEnvironment.homeContents) {
                            homeDir.contents = window.sshOriginalEnvironment.homeContents;
                        }

                        // Restore original environment
                        environment.USER = window.sshOriginalEnvironment.USER;
                        environment.HOME = window.sshOriginalEnvironment.HOME;
                        environment.CWD = window.sshOriginalEnvironment.CWD;
                        environment.HOSTNAME = window.sshOriginalEnvironment.HOSTNAME;

                        // Clear SSH session
                        delete window.sshOriginalEnvironment;

                        // Reset to initial user
                        resetToInitialUser();
                    });
                });
            }
            windowElement.remove();
            taskbarButton.remove();
            delete openWindows[id];
            if (openWindows.active === id) {
                openWindows.active = null;
            }
        });
    }

    const minimizeButton = windowElement.querySelector('.minimize-button');
    if (minimizeButton) {
        minimizeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            windowElement.style.display = 'none';
            if (openWindows.active === id) {
                openWindows.active = null;
                taskbarButton.classList.remove('active');
            }
        });
    }

    if (maximizable) {
        const maximizeButton = windowElement.querySelector('.maximize-button');
        if (maximizeButton) {
            let isMaximized = false;
            let originalState = {};
            maximizeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!isMaximized) {
                    originalState = { width: windowElement.style.width, height: windowElement.style.height, left: windowElement.style.left, top: windowElement.style.top };
                    windowElement.style.width = '100vw';
                    windowElement.style.height = `calc(100vh - 40px)`;
                    windowElement.style.left = '0';
                    windowElement.style.top = '0';
                } else {
                    windowElement.style.width = originalState.width;
                    windowElement.style.height = originalState.height;
                    windowElement.style.left = originalState.left;
                    windowElement.style.top = originalState.top;
                }
                isMaximized = !isMaximized;
            });
        }
    }

    return windowElement;
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Background Animation (Matrix Rain) ---
    const canvas = document.getElementById('background-canvas');
    if (!canvas) {
        console.warn('Background canvas not found in DOM');
        return;
    }

    const ctx = canvas.getContext('2d');
    const matrixToggleButton = document.getElementById('matrix-toggle-button');

    let W = window.innerWidth;
    let H = window.innerHeight - 40; // Account for taskbar
    canvas.width = W;
    canvas.height = H;

    canvas.style.display = 'none'; // Initially hidden

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()_+-=[]{}|;:,.<>/?';
    const charArr = characters.split('');

    const font_size = 16;
    let columns = Math.ceil(W / font_size);
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    let matrixInterval = null;
    let isMatrixOn = false;

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Fading effect
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#00ff00'; // Green text
        ctx.font = `${font_size}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = charArr[Math.floor(Math.random() * charArr.length)];
            ctx.fillText(text, i * font_size, drops[i] * font_size);

            if (drops[i] * font_size > H && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    function startMatrix() {
        canvas.style.display = 'block';
        if (!matrixInterval) {
            matrixInterval = setInterval(drawMatrix, 33);
        }
    }

    function stopMatrix() {
        clearInterval(matrixInterval);
        matrixInterval = null;
        ctx.clearRect(0, 0, W, H); // Clear the canvas
        canvas.style.display = 'none';
    }

    matrixToggleButton.addEventListener('click', () => {
        isMatrixOn = !isMatrixOn;
        if (isMatrixOn) {
            startMatrix();
            matrixToggleButton.textContent = 'Matrix: ON';
        } else {
            stopMatrix();
            matrixToggleButton.textContent = 'Matrix: OFF';
        }
    });

    window.addEventListener('resize', () => {
        W = window.innerWidth;
        H = window.innerHeight - 40;
        canvas.width = W;
        canvas.height = H;
        const newColumns = Math.floor(W / font_size);
        if (newColumns > columns) {
            for (let i = columns; i < newColumns; i++) {
                drops[i] = 1;
            }
        } else if (newColumns < columns) {
            drops.splice(newColumns);
        }
        columns = newColumns;
    });

    initStartMenu();
    initMusicPlayer();
    initTaskbar();
    initCalendar();

    const terminalQuickLaunchButton = document.getElementById('terminal-quick-launch-button');
    if (terminalQuickLaunchButton) {
        terminalQuickLaunchButton.addEventListener('click', createNewTerminalWindow);
    }



});

export { createWindow, openWindows, setActiveWindow };
