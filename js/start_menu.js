/**
 * Portable Desktop Environment - Start Menu
 * Simplified version with only core utilities
 */

import { createWindow } from './main.js';
import { createNewTerminalWindow } from './new_terminal.js';

function initStartMenu() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.querySelector('.start-menu');

    if (!startButton || !startMenu) {
        console.error('Start menu elements not found', {startButton, startMenu});
        return;
    }

    // --- Start Menu Functionality ---
    startButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default button behavior
        event.stopPropagation(); // Prevent event bubbling
        event.stopImmediatePropagation(); // Prevent other handlers on same element

        const isHidden = startMenu.style.display === 'none';
        startMenu.style.display = isHidden ? 'block' : 'none';
    }, true); // Use capture phase

    // Close start menu if clicked outside
    document.addEventListener('click', (event) => {
        if (startMenu.style.display !== 'none' &&
            !startMenu.contains(event.target) &&
            !startButton.contains(event.target)) {
            startMenu.style.display = 'none';
        }
    });

    // Handle menu item clicks
    const menuItems = startMenu.querySelectorAll('.start-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const app = item.getAttribute('data-app');

            switch(app) {
                case 'terminal':
                    createNewTerminalWindow();
                    break;
                case 'music':
                    // Music player
                    const musicPlayerButton = document.getElementById('music-player-button');
                    if (musicPlayerButton) {
                        musicPlayerButton.click();
                    }
                    break;
                default:
                    console.log('Unknown app:', app);
            }

            // Close menu after selection
            startMenu.style.display = 'none';
        });
    });
}

export { initStartMenu };
