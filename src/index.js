/* ============================================================================
   TERMINAL KIT - Main Entry Point
   A portable terminal simulator with music player, taskbar, and matrix rain

   Usage:
   import { TerminalKit } from './terminal-kit/index.js';

   TerminalKit.init({
       terminal: true,
       musicPlayer: true,
       taskbar: true,
       matrixRain: true,
       playlist: [
           { title: "Song Title", src: "/path/to/song.mp3" }
       ]
   });
   ============================================================================ */

import { createTerminal, showTerminal, hideTerminal, toggleTerminal, isTerminalVisible, getTopZIndex as getTerminalZ, setTopZIndex as setTerminalZ, getSavedVisibility as getTerminalSavedVisibility } from './terminal.js';
import { createMusicPlayer, showMusicPlayer, hideMusicPlayer, toggleMusicPlayer, isMusicPlayerVisible, getTopZIndex as getMusicPlayerZ, setTopZIndex as setMusicPlayerZ, setPlaylist, getSavedVisibility as getMusicPlayerSavedVisibility } from './music-player.js';
import { createTaskbar, updateButtonStates, showTaskbar, hideTaskbar, destroyTaskbar, setCallbacks, setMatrixCallbacks } from './taskbar.js';
import { initMatrixRain, startMatrixRain, stopMatrixRain, toggleMatrixRain, isMatrixRunning } from './matrix-rain.js';

// ============================================================================
// SHARED Z-INDEX MANAGEMENT
// ============================================================================

let sharedTopZIndex = 10000;

function syncZIndex() {
    // Get the max z-index from both windows
    const termZ = getTerminalZ();
    const musicZ = getMusicPlayerZ();
    sharedTopZIndex = Math.max(sharedTopZIndex, termZ, musicZ);

    // Sync both modules to use the same top value
    setTerminalZ(sharedTopZIndex);
    setMusicPlayerZ(sharedTopZIndex);
}

// Periodically sync z-index (handles when either window is clicked)
setInterval(syncZIndex, 50);

// ============================================================================
// TERMINAL KIT CONFIGURATION
// ============================================================================

// Default playlist - can be overridden via config
const defaultPlaylist = [
    { title: "Twenty Minutes - edIT", src: "/mp3/01 - edIT - Twenty Minutes.mp3" },
    { title: "Access Granted - The Alg0rithm", src: "/mp3/02 - The Alg0rithm - Access Granted.mp3" },
    { title: "MSDOS.SYS - Master Boot Record", src: "/mp3/03 - Master Boot Record - MSDOS.SYS.mp3" },
    { title: "Tendon - Igorrr", src: "/mp3/04- Igorrr - Tendon.mp3" },
    { title: "Dex - edIT", src: "/mp3/05 - edIT - Dex.mp3" },
    { title: "Tr0jans - The Alg0rithm", src: "/mp3/06 - The Alg0rithm - Trojans.mp3" },
    { title: "CONFIG.SYS - Master Boot Record", src: "/mp3/07 - Master Boot Record - CONFIG.SYS.mp3" },
    { title: "Excessive Funeral - Igorrr", src: "/mp3/08 - Igorrr - Excessive Funeral.mp3" }
];

const defaultConfig = {
    terminal: true,
    musicPlayer: true,
    taskbar: true,
    matrixRain: true,
    playlist: defaultPlaylist,
    terminalOptions: {
        x: 100,
        y: 80,
        width: 700,
        height: 450,
        autoShow: true
    },
    musicPlayerOptions: {
        x: 150,
        y: 150,
        autoShow: false
    },
    matrixOptions: {
        containerId: 'matrixRain',
        autoStart: true
    }
};

let isInitialized = false;
let currentConfig = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

function init(config = {}) {
    if (isInitialized) {
        console.warn('[TerminalKit] Already initialized');
        return;
    }

    currentConfig = { ...defaultConfig, ...config };

    // Merge nested options
    currentConfig.terminalOptions = { ...defaultConfig.terminalOptions, ...(config.terminalOptions || {}) };
    currentConfig.musicPlayerOptions = { ...defaultConfig.musicPlayerOptions, ...(config.musicPlayerOptions || {}) };
    currentConfig.matrixOptions = { ...defaultConfig.matrixOptions, ...(config.matrixOptions || {}) };

    // Use provided playlist or default
    if (config.playlist) {
        currentConfig.playlist = config.playlist;
    }

    console.log('[TerminalKit] Initializing with config:', currentConfig);

    // Initialize matrix rain first (background layer)
    if (currentConfig.matrixRain) {
        initMatrixRain(currentConfig.matrixOptions);
    }

    // Create taskbar (so buttons work when windows are created)
    if (currentConfig.taskbar) {
        // Set callbacks first to avoid circular dependency issues
        setCallbacks({
            toggleTerminal,
            isTerminalVisible,
            toggleMusicPlayer,
            isMusicPlayerVisible
        });

        // Set matrix callbacks if matrix is enabled
        if (currentConfig.matrixRain) {
            setMatrixCallbacks({
                toggleMatrixRain,
                isMatrixRunning
            });
        }

        createTaskbar();
    }

    // Set playlist before creating music player
    if (currentConfig.playlist) {
        setPlaylist(currentConfig.playlist);
    }

    // Create terminal
    if (currentConfig.terminal) {
        const terminalOpts = {
            ...currentConfig.terminalOptions,
            onClose: () => {
                updateButtonStates();
            },
            onMinimize: () => {
                updateButtonStates();
            }
        };

        createTerminal(terminalOpts);

        // Check saved visibility first, then fall back to autoShow config
        const terminalSavedVisible = getTerminalSavedVisibility();
        if (terminalSavedVisible !== null) {
            // Use saved state
            if (!terminalSavedVisible) {
                hideTerminal();
            }
        } else {
            // No saved state, use autoShow config
            if (!currentConfig.terminalOptions.autoShow) {
                hideTerminal();
            }
        }
    }

    // Create music player
    if (currentConfig.musicPlayer) {
        const musicOpts = {
            ...currentConfig.musicPlayerOptions,
            onClose: () => {
                updateButtonStates();
            },
            onMinimize: () => {
                updateButtonStates();
            }
        };

        createMusicPlayer(musicOpts);

        // Check saved visibility first, then fall back to autoShow config
        const musicSavedVisible = getMusicPlayerSavedVisibility();
        if (musicSavedVisible !== null) {
            // Use saved state
            if (!musicSavedVisible) {
                hideMusicPlayer();
            }
        } else {
            // No saved state, use autoShow config
            if (!currentConfig.musicPlayerOptions.autoShow) {
                hideMusicPlayer();
            }
        }
    }

    // Update button states
    if (currentConfig.taskbar) {
        updateButtonStates();
    }

    isInitialized = true;
    console.log('[TerminalKit] Initialization complete');
}

// ============================================================================
// PUBLIC API
// ============================================================================

const TerminalKit = {
    // Initialization
    init,

    // Terminal controls
    showTerminal,
    hideTerminal,
    toggleTerminal,
    isTerminalVisible,

    // Music player controls
    showMusicPlayer,
    hideMusicPlayer,
    toggleMusicPlayer,
    isMusicPlayerVisible,
    setPlaylist,

    // Taskbar controls
    showTaskbar,
    hideTaskbar,

    // Matrix rain controls
    startMatrixRain,
    stopMatrixRain,
    toggleMatrixRain,
    isMatrixRunning,

    // Status
    isInitialized: () => isInitialized,
    getConfig: () => currentConfig
};

// ============================================================================
// AUTO-INITIALIZATION (optional)
// ============================================================================

// Check for auto-init data attribute on script tag
document.addEventListener('DOMContentLoaded', () => {
    // Look for script with data-auto-init attribute
    const scriptTag = document.querySelector('script[src*="terminal-kit/index.js"][data-auto-init]');
    if (scriptTag) {
        const autoInitConfig = scriptTag.dataset.autoInit;
        try {
            const config = autoInitConfig ? JSON.parse(autoInitConfig) : {};
            init(config);
        } catch (e) {
            console.error('[TerminalKit] Error parsing auto-init config:', e);
            init();
        }
    }
});

// ============================================================================
// EXPORTS
// ============================================================================

export { TerminalKit };
export default TerminalKit;

// Also expose to window for non-module usage
if (typeof window !== 'undefined') {
    window.TerminalKit = TerminalKit;
}
