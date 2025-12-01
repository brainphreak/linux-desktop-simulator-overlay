/* ============================================================================
   TERMINAL KIT - Taskbar Module
   Adapted from brainphreak.net for theblackpacket
   ============================================================================ */

// Note: We use function references instead of direct imports to avoid circular dependencies
// The toggle functions will be set after initialization

// ============================================================================
// TASKBAR STATE
// ============================================================================

let taskbar = null;
let terminalBtn = null;
let timeDisplay = null;
let dateDisplay = null;

let clockInterval = null;
let matrixEnabled = true;

// Function references (set via setCallbacks to avoid circular imports)
let terminalToggleFn = null;
let terminalVisibleFn = null;
let musicToggleFn = null;
let musicVisibleFn = null;

// Matrix function references (set via setMatrixCallbacks)
let matrixToggleFn = null;
let matrixRunningFn = null;

// Set callback functions (called from index.js after all modules are loaded)
export function setCallbacks(callbacks) {
    terminalToggleFn = callbacks.toggleTerminal || null;
    terminalVisibleFn = callbacks.isTerminalVisible || null;
    musicToggleFn = callbacks.toggleMusicPlayer || null;
    musicVisibleFn = callbacks.isMusicPlayerVisible || null;
}

// Set matrix callback functions (called from index.js)
export function setMatrixCallbacks(callbacks) {
    matrixToggleFn = callbacks.toggleMatrixRain || null;
    matrixRunningFn = callbacks.isMatrixRunning || null;
}

// ============================================================================
// MATRIX RAIN TOGGLE
// ============================================================================

function toggleMatrixRain() {
    if (matrixToggleFn) {
        matrixToggleFn();
    }

    // Update button text
    updateMatrixButtonState();
}

function updateMatrixButtonState() {
    const toggleBtn = document.getElementById('tk-matrix-toggle-btn');
    if (toggleBtn && matrixRunningFn) {
        matrixEnabled = matrixRunningFn();
        toggleBtn.textContent = matrixEnabled ? 'Matrix: ON' : 'Matrix: OFF';
    }
}

export function isMatrixEnabled() {
    if (matrixRunningFn) {
        return matrixRunningFn();
    }
    return matrixEnabled;
}

// ============================================================================
// TASKBAR CREATION
// ============================================================================

export function createTaskbar() {
    // Create taskbar element
    taskbar = document.createElement('div');
    taskbar.id = 'tk-taskbar';

    // Create start/app section
    const startSection = document.createElement('div');
    startSection.className = 'tk-taskbar-start';

    // Terminal button - styled like brainphreak with >_ icon via CSS
    terminalBtn = document.createElement('button');
    terminalBtn.className = 'tk-quick-launch-btn tk-terminal-quick-launch';
    terminalBtn.id = 'tk-terminal-quick-launch-btn';
    // Button shows >_ via CSS ::before and ::after pseudo-elements
    terminalBtn.onclick = () => {
        if (terminalToggleFn) terminalToggleFn();
        updateButtonStates();
    };

    startSection.appendChild(terminalBtn);

    // Create apps container (for dynamic taskbar buttons)
    const appsContainer = document.createElement('div');
    appsContainer.className = 'tk-taskbar-apps';
    appsContainer.id = 'tk-taskbar-apps';

    // Create systray section
    const systray = document.createElement('div');
    systray.className = 'tk-taskbar-systray';

    // Music button in systray with icon
    const musicSystrayBtn = document.createElement('button');
    musicSystrayBtn.className = 'tk-quick-launch-btn';
    musicSystrayBtn.id = 'tk-music-systray-btn';
    musicSystrayBtn.textContent = 'Music';
    musicSystrayBtn.onclick = () => {
        if (musicToggleFn) musicToggleFn();
        updateButtonStates();
    };
    systray.appendChild(musicSystrayBtn);

    // Matrix toggle button in systray
    const matrixToggleBtn = document.createElement('button');
    matrixToggleBtn.className = 'tk-quick-launch-btn';
    matrixToggleBtn.id = 'tk-matrix-toggle-btn';
    matrixToggleBtn.textContent = 'Matrix: ON';
    matrixToggleBtn.onclick = () => {
        toggleMatrixRain();
    };
    systray.appendChild(matrixToggleBtn);

    // Time display
    const timeContainer = document.createElement('div');
    timeContainer.className = 'tk-taskbar-time';

    timeDisplay = document.createElement('div');
    timeDisplay.id = 'tk-current-time';
    timeDisplay.textContent = '00:00';

    dateDisplay = document.createElement('div');
    dateDisplay.id = 'tk-current-date';
    dateDisplay.textContent = 'Jan 1, 2025';

    timeContainer.appendChild(timeDisplay);
    timeContainer.appendChild(dateDisplay);
    systray.appendChild(timeContainer);

    // Assemble taskbar
    taskbar.appendChild(startSection);
    taskbar.appendChild(appsContainer);
    taskbar.appendChild(systray);

    // Add to document
    document.body.appendChild(taskbar);

    // Start clock
    startClock();

    // Initial button state update
    updateButtonStates();

    return taskbar;
}

// ============================================================================
// CLOCK FUNCTIONS
// ============================================================================

function startClock() {
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();

    // Time - 12-hour format with AM/PM like brainphreak
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = `${String(hours).padStart(2, ' ')}:${minutes}:${seconds} ${ampm}`;
    if (timeDisplay) {
        timeDisplay.textContent = strTime;
    }

    // Date - weekday, month day, year format like brainphreak
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    if (dateDisplay) {
        dateDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
}

function stopClock() {
    if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
    }
}

// ============================================================================
// BUTTON STATE MANAGEMENT
// ============================================================================

export function updateButtonStates() {
    if (terminalBtn) {
        if (terminalVisibleFn && terminalVisibleFn()) {
            terminalBtn.classList.add('active');
        } else {
            terminalBtn.classList.remove('active');
        }
    }

    // Update systray music button
    const musicSystrayBtn = document.getElementById('tk-music-systray-btn');
    if (musicSystrayBtn) {
        if (musicVisibleFn && musicVisibleFn()) {
            musicSystrayBtn.classList.add('active');
        } else {
            musicSystrayBtn.classList.remove('active');
        }
    }
}

// ============================================================================
// TASKBAR APP BUTTONS (for future use)
// ============================================================================

export function addTaskbarApp(id, title, onClick) {
    const appsContainer = document.getElementById('tk-taskbar-apps');
    if (!appsContainer) return null;

    const btn = document.createElement('button');
    btn.id = `tk-taskbar-btn-${id}`;
    btn.className = 'tk-taskbar-app-button';
    btn.textContent = title;
    btn.onclick = onClick;

    appsContainer.appendChild(btn);
    return btn;
}

export function removeTaskbarApp(id) {
    const btn = document.getElementById(`tk-taskbar-btn-${id}`);
    if (btn) {
        btn.remove();
    }
}

export function setTaskbarAppActive(id, active) {
    const btn = document.getElementById(`tk-taskbar-btn-${id}`);
    if (btn) {
        if (active) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }
}

// ============================================================================
// VISIBILITY CONTROLS
// ============================================================================

export function showTaskbar() {
    if (taskbar) {
        taskbar.style.display = 'flex';
    }
}

export function hideTaskbar() {
    if (taskbar) {
        taskbar.style.display = 'none';
    }
}

// ============================================================================
// CLEANUP
// ============================================================================

export function destroyTaskbar() {
    stopClock();
    if (taskbar) {
        taskbar.remove();
        taskbar = null;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    taskbar,
    startClock,
    stopClock
};
