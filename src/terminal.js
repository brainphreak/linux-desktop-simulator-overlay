/* ============================================================================
   TERMINAL KIT - Terminal UI Module
   Adapted from brainphreak.net for theblackpacket
   ============================================================================ */

import { environment, resetToInitialUser, addToHistory, getCurrentHistory, listDirectory, resolvePath } from './filesystem.js';
import { processCommand, commands, commandHelp } from './commands.js';

// ============================================================================
// TERMINAL STATE
// ============================================================================

let terminalWindow = null;
let terminalBody = null;
let terminalInnerContent = null;
let terminalTitleBar = null;
let terminalTitle = null;

let commandHistory = [];
let historyIndex = -1;
let currentInputElement = null;
let tabCompletionElement = null;
let isCommandRunning = false;

// Dragging state
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Resizing state
let isResizing = false;
let resizeDirection = '';
let resizeStartX = 0;
let resizeStartY = 0;
let resizeStartWidth = 0;
let resizeStartHeight = 0;
let resizeStartLeft = 0;
let resizeStartTop = 0;

// ============================================================================
// LOCALSTORAGE PERSISTENCE
// ============================================================================

const STORAGE_KEY = 'tk-terminal-state';

function loadSavedState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
}

export function getSavedVisibility() {
    const saved = loadSavedState();
    return saved?.visible ?? null; // null means no saved preference
}

function saveState() {
    if (!terminalWindow) return;
    try {
        const state = {
            x: parseInt(terminalWindow.style.left) || 100,
            y: parseInt(terminalWindow.style.top) || 80,
            width: parseInt(terminalWindow.style.width) || 700,
            height: parseInt(terminalWindow.style.height) || 450,
            visible: !terminalWindow.classList.contains('tk-hidden')
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        // Ignore storage errors
    }
}

// ============================================================================
// MOBILE DETECTION
// ============================================================================

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
}

let isMobile = false;
let mobileTerminalVisible = false;

// ============================================================================
// TERMINAL CREATION
// ============================================================================

export function createTerminal(options = {}) {
    const {
        x = 100,
        y = 100,
        width = 850,
        height = 750,
        onClose = null,
        onMinimize = null
    } = options;

    // Check if mobile
    isMobile = isMobileDevice();

    if (isMobile) {
        createMobileTerminal(options);
        return;
    }

    // Load saved state from localStorage, fallback to options
    const savedState = loadSavedState();
    const initialWidth = savedState?.width ?? width;
    const initialHeight = savedState?.height ?? height;

    // Calculate centered position if 'center' is specified
    let initialX, initialY;
    if (savedState?.x !== undefined) {
        initialX = savedState.x;
    } else if (x === 'center') {
        initialX = Math.max(0, (window.innerWidth - initialWidth) / 2);
    } else {
        initialX = x;
    }

    if (savedState?.y !== undefined) {
        initialY = savedState.y;
    } else if (y === 'center') {
        initialY = Math.max(0, (window.innerHeight - initialHeight - 40) / 2); // -40 for taskbar
    } else {
        initialY = y;
    }

    // Create terminal window
    terminalWindow = document.createElement('div');
    terminalWindow.id = 'tk-terminal';
    terminalWindow.className = 'tk-window tk-terminal';
    terminalWindow.style.left = `${initialX}px`;
    terminalWindow.style.top = `${initialY}px`;
    terminalWindow.style.width = `${initialWidth}px`;
    terminalWindow.style.height = `${initialHeight}px`;

    // Create title bar
    terminalTitleBar = document.createElement('div');
    terminalTitleBar.className = 'tk-window-title-bar';

    terminalTitle = document.createElement('span');
    terminalTitle.className = 'tk-terminal-title';
    terminalTitle.textContent = `${environment.USER}@${environment.HOSTNAME}:${getDisplayPath()}`;

    const controls = document.createElement('div');
    controls.className = 'tk-window-controls';

    const minimizeBtn = document.createElement('div');
    minimizeBtn.className = 'tk-window-btn minimize';
    minimizeBtn.title = 'Minimize';
    minimizeBtn.onclick = (e) => {
        e.stopPropagation();
        hideTerminal();
        if (onMinimize) onMinimize();
    };

    const maximizeBtn = document.createElement('div');
    maximizeBtn.className = 'tk-window-btn maximize';
    maximizeBtn.title = 'Maximize';
    maximizeBtn.onclick = (e) => {
        e.stopPropagation();
        toggleMaximize();
    };

    const closeBtn = document.createElement('div');
    closeBtn.className = 'tk-window-btn close';
    closeBtn.title = 'Close';
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        hideTerminal();
        if (onClose) onClose();
    };

    controls.appendChild(minimizeBtn);
    controls.appendChild(maximizeBtn);
    controls.appendChild(closeBtn);

    terminalTitleBar.appendChild(terminalTitle);
    terminalTitleBar.appendChild(controls);

    // Create terminal body
    terminalBody = document.createElement('div');
    terminalBody.className = 'tk-terminal-body';
    terminalBody.tabIndex = 0;

    terminalInnerContent = document.createElement('div');
    terminalInnerContent.className = 'tk-terminal-inner';
    terminalBody.appendChild(terminalInnerContent);

    // Assemble terminal
    terminalWindow.appendChild(terminalTitleBar);
    terminalWindow.appendChild(terminalBody);

    // Add resize handles
    addResizeHandles(terminalWindow);

    // Add to document
    document.body.appendChild(terminalWindow);

    // Bring to front on click
    terminalWindow.addEventListener('mousedown', bringToFront);

    // Setup event listeners
    setupDragging();
    setupTerminalInput();

    // Initialize terminal content
    initializeTerminal();

    return terminalWindow;
}

function addResizeHandles(window) {
    const directions = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
    directions.forEach(dir => {
        const handle = document.createElement('div');
        handle.className = `tk-resize-handle tk-resize-handle-${dir}`;
        handle.dataset.direction = dir;
        window.appendChild(handle);

        handle.addEventListener('mousedown', startResize);
    });
}

// ============================================================================
// TERMINAL INITIALIZATION
// ============================================================================

function initializeTerminal() {
    // Reset to initial user state
    resetToInitialUser();

    // Load command history
    commandHistory = getCurrentHistory();
    historyIndex = -1;

    // Clear and add welcome message
    terminalInnerContent.innerHTML = '';

    const welcomeLines = [
        'Welcome to The Black Packet Terminal v2.0',
        'Type "help" for available commands.',
        ''
    ];

    welcomeLines.forEach(line => {
        const output = document.createElement('div');
        output.className = 'tk-terminal-output';
        output.textContent = line;
        terminalInnerContent.appendChild(output);
    });

    // Create first input line
    createNewInputLine();

    // Update title
    updateTerminalTitle();
}

// ============================================================================
// INPUT HANDLING
// ============================================================================

function createNewInputLine() {
    const inputLine = document.createElement('div');
    inputLine.className = 'tk-terminal-input-line';

    const prompt = document.createElement('span');
    prompt.className = 'tk-terminal-prompt';
    prompt.textContent = getPromptText();

    const input = document.createElement('textarea');
    input.className = 'tk-terminal-input';
    input.rows = 1;
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('data-form-type', 'other');
    input.setAttribute('data-lpignore', 'true');
    input.setAttribute('data-1p-ignore', 'true');
    // Prevent Enter from creating newlines - handled in keydown
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') e.preventDefault();
    });

    inputLine.appendChild(prompt);
    inputLine.appendChild(input);
    terminalInnerContent.appendChild(inputLine);

    currentInputElement = input;

    // Setup input event listeners
    input.addEventListener('keydown', handleKeydown);

    // Remove tab completion when input changes (typing new characters)
    input.addEventListener('input', () => {
        removeTabCompletion();
    });

    // Focus input
    setTimeout(() => {
        input.focus();
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }, 10);
}

function removeTabCompletion() {
    if (tabCompletionElement && tabCompletionElement.parentNode) {
        tabCompletionElement.parentNode.removeChild(tabCompletionElement);
        tabCompletionElement = null;
    }
}

function handleKeydown(e) {
    const input = e.target;

    if (e.key === 'Enter') {
        e.preventDefault();

        // Remove tab completion suggestions
        removeTabCompletion();

        const command = input.value.trim();

        if (command) {
            // Add to history
            addToHistory(command);
            commandHistory = getCurrentHistory();
        }
        historyIndex = -1;

        // Process command
        executeCommand(command);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateHistory(-1, input);
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateHistory(1, input);
    } else if (e.key === 'Tab') {
        e.preventDefault();
        handleTabCompletion(input);
    } else if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        handleCtrlC(input);
    } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        clearTerminal();
    }
}

function navigateHistory(direction, input) {
    if (commandHistory.length === 0) return;

    if (direction === -1) {
        // Up - go to older commands
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        }
    } else {
        // Down - go to newer commands
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        } else if (historyIndex === 0) {
            historyIndex = -1;
            input.value = '';
        }
    }

    // Move cursor to end
    setTimeout(() => {
        input.selectionStart = input.selectionEnd = input.value.length;
    }, 0);
}

function handleTabCompletion(input) {
    const value = input.value;
    const parts = value.split(' ');
    const lastPart = parts[parts.length - 1];

    // Get available completions (commands or files)
    let completions = [];

    // Check if we're completing a command (first word, or after sudo)
    const isSudoPrefix = parts[0] === 'sudo';
    const isCompletingCommand = (parts.length === 1 && lastPart) ||
                                 (isSudoPrefix && parts.length === 2);

    if (isCompletingCommand) {
        // Complete command names
        const prefix = lastPart || '';
        completions = Object.keys(commands).filter(cmd => cmd.startsWith(prefix));
    } else {
        // Complete file/directory names
        let searchPath = lastPart || '';
        let dirPath = environment.CWD;
        let prefix = '';

        // Handle paths with directories
        if (searchPath.includes('/')) {
            const lastSlash = searchPath.lastIndexOf('/');
            dirPath = searchPath.substring(0, lastSlash) || '/';
            prefix = searchPath.substring(lastSlash + 1);

            // Resolve relative paths
            if (!dirPath.startsWith('/')) {
                dirPath = resolvePath(dirPath, environment.CWD);
            }
        } else {
            prefix = searchPath;
        }

        try {
            const items = listDirectory(dirPath);
            if (items && Array.isArray(items)) {
                completions = items
                    .filter(item => item.name.startsWith(prefix))
                    .map(item => {
                        const basePath = searchPath.includes('/')
                            ? searchPath.substring(0, searchPath.lastIndexOf('/') + 1)
                            : '';
                        return basePath + item.name + (item.type === 'directory' ? '/' : '');
                    });
            }
        } catch (e) {
            // Directory doesn't exist or can't be listed
        }
    }

    if (completions.length === 1) {
        // Remove any existing tab completion display
        removeTabCompletion();

        parts[parts.length - 1] = completions[0];
        input.value = parts.join(' ');
        // Add space after command completion, not after file/dir completion
        if (parts.length === 1) {
            input.value += ' ';
        }
    } else if (completions.length > 1) {
        // Find common prefix for partial completion
        let commonPrefix = completions[0];
        for (let i = 1; i < completions.length; i++) {
            while (!completions[i].startsWith(commonPrefix)) {
                commonPrefix = commonPrefix.substring(0, commonPrefix.length - 1);
            }
        }
        if (commonPrefix.length > (lastPart || '').length) {
            parts[parts.length - 1] = commonPrefix;
            input.value = parts.join(' ');
        }

        // Only show completions if not already showing
        if (!tabCompletionElement) {
            // Show available completions below the input line
            tabCompletionElement = document.createElement('div');
            tabCompletionElement.className = 'tk-terminal-output tk-tab-completion';
            tabCompletionElement.textContent = completions.join('  ');
            // Insert after the input line (input.parentNode is the input line)
            input.parentNode.parentNode.insertBefore(tabCompletionElement, input.parentNode.nextSibling);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }
}

function handleCtrlC(input) {
    // Remove tab completion suggestions
    removeTabCompletion();

    // Set interrupt flag for running commands
    window.isCommandInterrupted = true;

    // Create frozen line (without ^C)
    const inputLine = input.parentNode;
    const frozenLine = document.createElement('div');
    frozenLine.className = 'tk-terminal-frozen-line';
    frozenLine.textContent = getPromptText() + input.value;
    inputLine.parentNode.replaceChild(frozenLine, inputLine);

    // Create new input line
    createNewInputLine();
}

// ============================================================================
// COMMAND EXECUTION
// ============================================================================

async function executeCommand(cmd) {
    // Reset interrupt flag before running command
    window.isCommandInterrupted = false;
    isCommandRunning = true;

    // Create a wait key function for interactive commands
    const waitKey = () => {
        return new Promise((resolve) => {
            const handler = (e) => {
                if (e.ctrlKey && e.key === 'c') {
                    document.removeEventListener('keydown', handler);
                    resolve('CTRL_C');
                } else if (e.key.length === 1 || e.key === 'Enter' || e.key === ' ') {
                    document.removeEventListener('keydown', handler);
                    resolve(e.key);
                }
            };
            document.addEventListener('keydown', handler);
        });
    };

    // Process the command
    const result = await processCommand(cmd, {
        terminalInnerContent,
        terminalBody,
        currentInput: currentInputElement,
        commandHistory,
        username: environment.USER,
        getDisplayPath,
        getPromptText,
        setNewCurrentDirectory: (newDir, oldDir) => {
            environment.OLDPWD = oldDir;
            environment.CWD = newDir;
            updateTerminalTitle();
        },
        waitKey
    });

    // Update title after command execution
    updateTerminalTitle();
    isCommandRunning = false;

    // Create new input line
    createNewInputLine();
}

// ============================================================================
// OUTPUT FUNCTIONS
// ============================================================================

export function printOutput(text, className = 'tk-terminal-output', useHTML = false) {
    if (text === null || text === undefined) return;

    const lines = text.toString().split('\n');
    lines.forEach(line => {
        const output = document.createElement('div');
        output.className = className;
        if (useHTML) {
            output.innerHTML = line;
        } else {
            output.textContent = line;
        }

        // Insert before current input line if it exists
        if (currentInputElement && currentInputElement.parentNode) {
            terminalInnerContent.insertBefore(output, currentInputElement.parentNode);
        } else {
            terminalInnerContent.appendChild(output);
        }
    });

    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function clearTerminal() {
    terminalInnerContent.innerHTML = '';
    createNewInputLine();
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getDisplayPath() {
    let path = environment.CWD;
    if (path.startsWith(environment.HOME)) {
        path = '~' + path.substring(environment.HOME.length);
    }
    return path || '~';
}

function getPromptText() {
    const user = environment.USER;
    const host = environment.HOSTNAME;
    const path = getDisplayPath();
    const symbol = user === 'root' ? '#' : '$';
    return `${user}@${host}:${path}${symbol} `;
}

function updateTerminalTitle() {
    if (terminalTitle) {
        terminalTitle.textContent = `${environment.USER}@${environment.HOSTNAME}:${getDisplayPath()}`;
    }
}

// ============================================================================
// WINDOW MANAGEMENT
// ============================================================================

function setupDragging() {
    terminalTitleBar.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function startDrag(e) {
    if (e.target.classList.contains('tk-window-btn')) return;

    isDragging = true;
    dragOffsetX = e.clientX - terminalWindow.offsetLeft;
    dragOffsetY = e.clientY - terminalWindow.offsetTop;
    terminalTitleBar.style.cursor = 'grabbing';
    document.body.classList.add('tk-no-select');
}

function startResize(e) {
    isResizing = true;
    resizeDirection = e.target.dataset.direction;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    resizeStartWidth = terminalWindow.offsetWidth;
    resizeStartHeight = terminalWindow.offsetHeight;
    resizeStartLeft = terminalWindow.offsetLeft;
    resizeStartTop = terminalWindow.offsetTop;
    document.body.classList.add('tk-no-select');
    e.preventDefault();
}

function onMouseMove(e) {
    if (isDragging) {
        const newLeft = e.clientX - dragOffsetX;
        const newTop = Math.max(0, e.clientY - dragOffsetY);
        terminalWindow.style.left = `${newLeft}px`;
        terminalWindow.style.top = `${newTop}px`;
    } else if (isResizing) {
        const dx = e.clientX - resizeStartX;
        const dy = e.clientY - resizeStartY;

        if (resizeDirection.includes('e')) {
            terminalWindow.style.width = `${Math.max(300, resizeStartWidth + dx)}px`;
        }
        if (resizeDirection.includes('w')) {
            const newWidth = Math.max(300, resizeStartWidth - dx);
            terminalWindow.style.width = `${newWidth}px`;
            terminalWindow.style.left = `${resizeStartLeft + (resizeStartWidth - newWidth)}px`;
        }
        if (resizeDirection.includes('s')) {
            terminalWindow.style.height = `${Math.max(200, resizeStartHeight + dy)}px`;
        }
        if (resizeDirection.includes('n')) {
            const newHeight = Math.max(200, resizeStartHeight - dy);
            terminalWindow.style.height = `${newHeight}px`;
            terminalWindow.style.top = `${Math.max(0, resizeStartTop + (resizeStartHeight - newHeight))}px`;
        }
    }
}

function onMouseUp() {
    if (isDragging) {
        isDragging = false;
        terminalTitleBar.style.cursor = 'grab';
        saveState(); // Save position after drag
    }
    if (isResizing) {
        isResizing = false;
        saveState(); // Save size after resize
    }
    document.body.classList.remove('tk-no-select');
}

let isMaximized = false;
let preMaximizeState = null;

function toggleMaximize() {
    if (isMaximized) {
        // Restore
        terminalWindow.style.left = preMaximizeState.left;
        terminalWindow.style.top = preMaximizeState.top;
        terminalWindow.style.width = preMaximizeState.width;
        terminalWindow.style.height = preMaximizeState.height;
        isMaximized = false;
    } else {
        // Maximize
        preMaximizeState = {
            left: terminalWindow.style.left,
            top: terminalWindow.style.top,
            width: terminalWindow.style.width,
            height: terminalWindow.style.height
        };
        terminalWindow.style.left = '0';
        terminalWindow.style.top = '0';
        terminalWindow.style.width = '100%';
        terminalWindow.style.height = `calc(100vh - 40px)`;
        isMaximized = true;
    }
}

// ============================================================================
// VISIBILITY CONTROLS
// ============================================================================

export function showTerminal() {
    if (isMobile) {
        showMobileTerminal();
        return;
    }
    if (terminalWindow) {
        terminalWindow.classList.remove('tk-hidden');
        if (currentInputElement) {
            currentInputElement.focus();
        }
        saveState();
    }
}

export function hideTerminal() {
    if (isMobile) {
        hideMobileTerminal();
        return;
    }
    if (terminalWindow) {
        terminalWindow.classList.add('tk-hidden');
        saveState();
    }
}

export function toggleTerminal() {
    if (isMobile) {
        if (mobileTerminalVisible) {
            hideMobileTerminal();
        } else {
            showMobileTerminal();
        }
        return;
    }
    if (terminalWindow) {
        if (terminalWindow.classList.contains('tk-hidden')) {
            showTerminal();
        } else {
            hideTerminal();
        }
    }
}

export function isTerminalVisible() {
    if (isMobile) {
        return mobileTerminalVisible;
    }
    return terminalWindow && !terminalWindow.classList.contains('tk-hidden');
}

// ============================================================================
// Z-INDEX MANAGEMENT
// ============================================================================

let topZIndex = 10000;

function bringToFront() {
    topZIndex++;
    terminalWindow.style.zIndex = topZIndex;
}

export function getTopZIndex() {
    return topZIndex;
}

export function setTopZIndex(z) {
    topZIndex = z;
}

// ============================================================================
// TERMINAL BODY CLICK HANDLER
// ============================================================================

function setupTerminalInput() {
    // Global Ctrl+C handler for interrupting running commands
    document.addEventListener('keydown', (e) => {
        if (e.key === 'c' && e.ctrlKey && isTerminalVisible()) {
            e.preventDefault();
            window.isCommandInterrupted = true;
        }
    });

    terminalBody.addEventListener('click', (e) => {
        if (currentInputElement && !e.target.classList.contains('tk-terminal-input')) {
            currentInputElement.focus();
        }
    });
}

// ============================================================================
// MOBILE TERMINAL
// ============================================================================

let mobileTerminalOverlay = null;
let mobileTerminalOutput = null;
let mobileTerminalInput = null;
let mobileTerminalPrompt = null;
let mobileOnClose = null;
let mobileCommandRunning = false;

function createMobileTerminal(options = {}) {
    const { onClose = null, onMinimize = null } = options;
    mobileOnClose = onClose;

    // Create overlay container
    mobileTerminalOverlay = document.createElement('div');
    mobileTerminalOverlay.id = 'tk-mobile-terminal-overlay';
    mobileTerminalOverlay.className = 'tk-mobile-terminal-overlay tk-hidden';
    mobileTerminalOverlay.innerHTML = `
        <div class="tk-mobile-terminal">
            <div class="tk-mobile-terminal-header">
                <span class="tk-mobile-terminal-title">The Black Packet Terminal</span>
                <button class="tk-mobile-terminal-close" id="tk-mobile-close">&times;</button>
            </div>
            <div class="tk-mobile-terminal-output" id="tk-mobile-output"></div>
            <div class="tk-mobile-terminal-input-area">
                <span class="tk-mobile-terminal-prompt" id="tk-mobile-prompt">user@blackpacket:~$ </span>
                <input type="text" class="tk-mobile-terminal-input" id="tk-mobile-input"
                       autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
            </div>
            <div class="tk-mobile-terminal-controls">
                <button class="tk-mobile-ctrl-btn" id="tk-mobile-up">↑</button>
                <button class="tk-mobile-ctrl-btn" id="tk-mobile-down">↓</button>
                <button class="tk-mobile-ctrl-btn" id="tk-mobile-tab">⇥ Tab</button>
                <button class="tk-mobile-ctrl-btn tk-mobile-ctrl-c" id="tk-mobile-ctrlc">^C</button>
            </div>
        </div>
    `;

    document.body.appendChild(mobileTerminalOverlay);

    // Get references
    mobileTerminalOutput = document.getElementById('tk-mobile-output');
    mobileTerminalInput = document.getElementById('tk-mobile-input');
    mobileTerminalPrompt = document.getElementById('tk-mobile-prompt');

    // Setup event listeners
    setupMobileTerminalEvents();

    // Add welcome message
    appendMobileOutput('Welcome to The Black Packet Mobile Terminal v1.0');
    appendMobileOutput('Type \'help\' for available commands');
    appendMobileOutput('Curiosity is not a crime.');
    appendMobileOutput('');

    updateMobilePrompt();
}

function setupMobileTerminalEvents() {
    const closeBtn = document.getElementById('tk-mobile-close');
    const upBtn = document.getElementById('tk-mobile-up');
    const downBtn = document.getElementById('tk-mobile-down');
    const tabBtn = document.getElementById('tk-mobile-tab');
    const ctrlcBtn = document.getElementById('tk-mobile-ctrlc');

    // Close button
    closeBtn.addEventListener('click', () => {
        hideMobileTerminal();
        if (mobileOnClose) mobileOnClose();
    });

    // Input handling
    mobileTerminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeMobileCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            navigateMobileHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            navigateMobileHistory(1);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            performMobileTabCompletion();
        } else if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            handleMobileCtrlC();
        }
    });

    // Control buttons
    upBtn.addEventListener('click', () => {
        navigateMobileHistory(-1);
        mobileTerminalInput.focus();
    });

    downBtn.addEventListener('click', () => {
        navigateMobileHistory(1);
        mobileTerminalInput.focus();
    });

    tabBtn.addEventListener('click', () => {
        performMobileTabCompletion();
        mobileTerminalInput.focus();
    });

    ctrlcBtn.addEventListener('click', () => {
        handleMobileCtrlC();
        mobileTerminalInput.focus();
    });

    // Focus input when tapping output
    mobileTerminalOutput.addEventListener('click', () => {
        mobileTerminalInput.focus();
    });
}

function appendMobileOutput(text, isPromptLine = false) {
    const lines = text.split('\n');
    lines.forEach(line => {
        const div = document.createElement('div');
        div.className = isPromptLine ? 'tk-mobile-line tk-mobile-prompt-line' : 'tk-mobile-line';
        div.textContent = line;
        mobileTerminalOutput.appendChild(div);
    });
    mobileTerminalOutput.scrollTop = mobileTerminalOutput.scrollHeight;
}

function appendMobileLolcatOutput(text) {
    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#8b00ff'];
    const lines = text.split('\n');

    lines.forEach(line => {
        const div = document.createElement('div');
        div.className = 'tk-mobile-line';
        let colorIdx = 0;
        for (let i = 0; i < line.length; i++) {
            const span = document.createElement('span');
            span.textContent = line[i];
            span.style.color = colors[colorIdx % colors.length];
            div.appendChild(span);
            if (line[i] !== ' ') colorIdx++;
        }
        mobileTerminalOutput.appendChild(div);
    });
    mobileTerminalOutput.scrollTop = mobileTerminalOutput.scrollHeight;
}

function updateMobilePrompt() {
    const displayPath = getDisplayPath();
    mobileTerminalPrompt.textContent = `${environment.USER}@${environment.HOSTNAME}:${displayPath}$ `;
}

async function executeMobileCommand() {
    const command = mobileTerminalInput.value.trim();
    mobileTerminalInput.value = '';

    // Show the command
    appendMobileOutput(mobileTerminalPrompt.textContent + command, true);

    if (!command) {
        return;
    }

    // Add to history
    commandHistory.push(command);
    addToHistory(command);
    historyIndex = commandHistory.length;

    // Handle clear
    if (command.toLowerCase() === 'clear') {
        mobileTerminalOutput.innerHTML = '';
        updateMobilePrompt();
        return;
    }

    // Parse command and arguments
    const parts = command.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const cmdName = parts[0]?.toLowerCase();
    const args = parts;

    // Create mobile context for commands
    const mobileCtx = {
        setNewCurrentDirectory: (newDir, oldDir) => {
            environment.OLDPWD = oldDir;
            environment.CWD = newDir;
        },
        getDisplayPath,
        appendOutput: appendMobileOutput,
        environment,
        // Provide terminal body/content references for commands that need them
        terminalBody: mobileTerminalOutput,
        terminalInnerContent: mobileTerminalOutput,
        // Mobile doesn't support waitKey, provide a no-op
        waitKey: async () => ' '
    };

    // Mark command as running
    mobileCommandRunning = true;
    window.isCommandInterrupted = false;

    // Execute command
    try {
        let result;

        // Check if command exists
        if (commands[cmdName]) {
            result = await commands[cmdName].execute(args, mobileCtx);
        } else {
            result = `${cmdName}: command not found`;
        }

        // Handle result
        if (result && typeof result === 'object') {
            if (result.type === 'lolcat') {
                appendMobileLolcatOutput(result.text);
            } else if (result.output) {
                appendMobileOutput(result.output);
            } else if (result.message) {
                appendMobileOutput(result.message);
            }
        } else if (result) {
            appendMobileOutput(result);
        }
    } catch (e) {
        appendMobileOutput(`Error: ${e.message}`);
    }

    // Command finished
    mobileCommandRunning = false;
    window.isCommandInterrupted = false;

    updateMobilePrompt();
}

function navigateMobileHistory(direction) {
    if (commandHistory.length === 0) return;

    historyIndex += direction;

    if (historyIndex < 0) {
        historyIndex = 0;
    } else if (historyIndex >= commandHistory.length) {
        historyIndex = commandHistory.length;
        mobileTerminalInput.value = '';
        return;
    }

    mobileTerminalInput.value = commandHistory[historyIndex] || '';
}

function performMobileTabCompletion() {
    const input = mobileTerminalInput.value;
    const parts = input.split(' ');
    const lastPart = parts[parts.length - 1];

    if (!lastPart) return;

    // Get completions
    const completions = [];

    // Command completions (if first word)
    if (parts.length === 1) {
        const cmdNames = Object.keys(commands);
        cmdNames.forEach(cmd => {
            if (cmd.startsWith(lastPart.toLowerCase())) {
                completions.push(cmd);
            }
        });
    }

    // File/directory completions
    try {
        let searchDir;
        let partialName;
        let pathPrefix = '';

        if (lastPart.startsWith('/')) {
            // Absolute path - extract directory and partial name
            const lastSlash = lastPart.lastIndexOf('/');
            searchDir = lastSlash === 0 ? '/' : lastPart.substring(0, lastSlash);
            partialName = lastPart.substring(lastSlash + 1);
            pathPrefix = searchDir === '/' ? '/' : searchDir + '/';
        } else if (lastPart.includes('/')) {
            // Relative path with directories
            const lastSlash = lastPart.lastIndexOf('/');
            const relDir = lastPart.substring(0, lastSlash);
            partialName = lastPart.substring(lastSlash + 1);
            searchDir = resolvePath(relDir, environment.CWD);
            pathPrefix = relDir + '/';
        } else {
            // Just a name in current directory
            searchDir = environment.CWD || '/home/user';
            partialName = lastPart;
            pathPrefix = '';
        }

        const contents = listDirectory(searchDir, true);
        if (Array.isArray(contents)) {
            contents.forEach(item => {
                if (item.name.startsWith(partialName)) {
                    completions.push(pathPrefix + item.name + (item.type === 'directory' ? '/' : ''));
                }
            });
        }
    } catch (e) {}

    if (completions.length === 1) {
        parts[parts.length - 1] = completions[0];
        mobileTerminalInput.value = parts.join(' ');
    } else if (completions.length > 1) {
        appendMobileOutput(mobileTerminalPrompt.textContent + input, true);
        appendMobileOutput(completions.join('  '));
    }
}

function handleMobileCtrlC() {
    // Set interrupt flag for running commands
    window.isCommandInterrupted = true;

    // Only show prompt line if no command is running (user is just canceling input)
    if (!mobileCommandRunning) {
        appendMobileOutput(mobileTerminalPrompt.textContent + mobileTerminalInput.value, true);
        mobileTerminalInput.value = '';
    }
}

function showMobileTerminal() {
    if (mobileTerminalOverlay) {
        mobileTerminalOverlay.classList.remove('tk-hidden');
        mobileTerminalVisible = true;
        // Delay focus slightly to prevent zoom issues
        setTimeout(() => {
            if (mobileTerminalInput) {
                mobileTerminalInput.focus();
            }
        }, 100);
        // Prevent body scroll when terminal is open
        document.body.style.overflow = 'hidden';
    }
}

function hideMobileTerminal() {
    if (mobileTerminalOverlay) {
        mobileTerminalOverlay.classList.add('tk-hidden');
        mobileTerminalVisible = false;
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

function isMobileTerminalVisible() {
    return mobileTerminalVisible;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    terminalWindow,
    terminalBody,
    terminalInnerContent,
    updateTerminalTitle,
    clearTerminal,
    getDisplayPath,
    getPromptText,
    isMobile,
    showMobileTerminal,
    hideMobileTerminal,
    isMobileTerminalVisible
};
