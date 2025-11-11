import { createNewTerminalWindow } from './new_terminal.js';

function initTaskbar() {
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const terminalQuickLaunchButton = document.getElementById('terminal-quick-launch-button');

    // Terminal quick launch button
    if (terminalQuickLaunchButton) {
        terminalQuickLaunchButton.addEventListener('click', () => {
            createNewTerminalWindow();
        });
    }

    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strTime = `${String(hours).padStart(2, ' ')}:${minutes}:${seconds} ${ampm}`;
        timeElement.textContent = strTime;

        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }

    setInterval(updateClock, 1000);
    updateClock(); // Initial call
}

export { initTaskbar };
