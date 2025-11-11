/**
 * Desktop Environment Initialization
 * Self-contained desktop environment with window manager, taskbar, calendar, music player, and terminal
 */

import { initStartMenu } from './start_menu.js';
import { initMusicPlayer } from './music_player.js';
import { initTaskbar } from './taskbar.js';
import { initCalendar } from './calendar.js';
import { createNewTerminalWindow } from './new_terminal.js';

// Guard to prevent double initialization
let isInitialized = false;

/**
 * Initialize the complete desktop environment
 * Call this function after the DOM is loaded
 */
function initDesktop() {
    if (isInitialized) {
        console.warn('Desktop already initialized, skipping...');
        return;
    }
    isInitialized = true;

    console.log('Initializing Desktop Environment...');

    // Initialize all components
    initStartMenu();
    initMusicPlayer();
    initTaskbar();
    initCalendar();

    console.log('Desktop Environment initialized successfully');
}

// Export main initialization function
export { initDesktop, createNewTerminalWindow };

// Also make it available globally
if (typeof window !== 'undefined') {
    window.initDesktop = initDesktop;
    window.createNewTerminalWindow = createNewTerminalWindow;
}
