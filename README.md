# Overlay Desktop Environment

A complete web-based desktop environment that floats over your existing website content. Features draggable windows, taskbar, music player, calendar, matrix rain effect, and a full Linux terminal emulator.

## Live Demo

Open `demo/overlay-mode.html` to see it in action!

See it live at www.brainphreak.net 

## Features

### Window Manager
- **Draggable Windows** - Click and drag title bars to move windows
- **Resizable Windows** - 8-directional resizing (corners and edges)
- **Window Controls** - Minimize, maximize, and close buttons
- **Focus Management** - Click any window to bring it to front
- **Taskbar Integration** - Click taskbar buttons to show/hide windows

### Applications

#### Terminal Emulator
- 50+ built-in Linux commands (ls, cd, cat, grep, ssh, nmap, etc.)
- SSH simulation to connect to remote hosts
- Tab completion for files and commands
- Command history with arrow keys
- Full virtual filesystem (/home, /etc, /bin, /usr, /var)
- User management (su, sudo, useradd)
- Network tools (ping, traceroute, netstat, ifconfig)

#### Music Player
- Play/pause/stop controls
- Volume control
- Track progress bar
- Playlist support
- Embedded in draggable window

#### Calendar
- Monthly calendar view
- Date navigation
- Current date highlighting
- Popup interface from taskbar

#### Matrix Rain Effect
- Toggle animated matrix-style background
- Runs behind all windows and content
- Does not interfere with website interaction

### Taskbar
- Start menu with application launcher
- Active window indicators
- System clock with calendar popup
- Matrix effect toggle
- Terminal quick-launch button

## Quick Start

### 1. Include the CSS Files

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Desktop Environment CSS -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/window.css">
    <link rel="stylesheet" href="css/taskbar.css">
    <link rel="stylesheet" href="css/calendar.css">
    <link rel="stylesheet" href="css/music_player.css">
    <link rel="stylesheet" href="css/new_terminal.css">

    <!-- CRITICAL: Include overlay-mode.css for floating behavior -->
    <link rel="stylesheet" href="css/overlay-mode.css">
</head>
<body>
    <!-- YOUR WEBSITE CONTENT -->
    <header>
        <h1>My Website</h1>
    </header>
    <main>
        <p>Your existing content stays visible and scrollable!</p>
    </main>
    <footer style="margin-bottom: 40px;">
        Footer (add 40px margin for taskbar)
    </footer>

    <!-- Desktop overlay (transparent, floats above) -->
    <div id="desktop">
        <canvas id="background-canvas"></canvas>
    </div>

    <!-- Taskbar (fixed at bottom) -->
    <div id="taskbar">
        <div class="taskbar-start-menu">
            <button id="start-button">Start</button>

            <!-- Start Menu -->
            <div class="start-menu" style="display: none;">
                <div class="start-menu-content">
                    <h3 style="color: #fff; padding: 10px; margin: 0; border-bottom: 1px solid #444;">Applications</h3>
                    <div class="start-menu-item" data-app="terminal">
                        <span>🖥️ Terminal</span>
                    </div>
                    <div class="start-menu-item" data-app="music">
                        <span>🎵 Music Player</span>
                    </div>
                    <p style="color: #888; padding: 10px; margin: 5px 0 0 0; font-size: 11px; border-top: 1px solid #333;">
                        💡 Click the date/time in the taskbar to view the calendar
                    </p>
                </div>
            </div>
        </div>

        <div class="taskbar-apps"></div>

        <div class="taskbar-right">
            <button id="terminal-quick-launch-button" class="taskbar-button">🖥️</button>
            <button id="matrix-toggle-button" class="taskbar-button">Matrix: OFF</button>
            <button id="music-player-button" class="taskbar-button">🎵</button>
            <div id="taskbar-clock" class="taskbar-button"></div>
        </div>
    </div>

    <!-- Calendar popup -->
    <div id="calendar-popup" style="display: none;"></div>

    <!-- Initialize Desktop -->
    <script type="module">
        import { initDesktop } from './js/desktop-init.js';

        document.addEventListener('DOMContentLoaded', () => {
            initDesktop();
        });
    </script>
</body>
</html>
```

### 2. File Structure

```
your-project/
├── css/
│   ├── main.css               # Core styles
│   ├── window.css             # Window styling
│   ├── taskbar.css            # Taskbar styling
│   ├── calendar.css           # Calendar widget
│   ├── music_player.css       # Music player
│   ├── new_terminal.css       # Terminal styles
│   └── overlay-mode.css       # CRITICAL: Overlay mode config
├── js/
│   ├── desktop-init.js        # Initialization
│   ├── main.js                # Window manager
│   ├── start_menu.js          # Start menu logic
│   ├── taskbar.js             # Taskbar logic
│   ├── calendar.js            # Calendar widget
│   ├── music_player.js        # Music player
│   ├── new_terminal.js        # Terminal emulator
│   ├── terminal_commands.js   # Terminal commands
│   └── terminal_filesystem.js # Virtual filesystem
└── demo/
    ├── overlay-mode.html      # Complete example
    └── music/                 # Sample music files
```

## How Overlay Mode Works

The overlay mode uses several CSS techniques to float the desktop environment over your content:

### Transparent Desktop
```css
#desktop {
    position: fixed;
    background: transparent !important;
    pointer-events: none; /* Clicks pass through to content below */
    z-index: 999;
}
```

### Interactive Windows
```css
#desktop .window {
    pointer-events: auto; /* Windows are interactive */
}
```

### Background Canvas
```css
#background-canvas {
    pointer-events: none !important; /* Matrix effect doesn't block clicks */
    z-index: 1 !important;
}
```

### Fixed Taskbar
```css
#taskbar {
    position: fixed;
    bottom: 0;
    z-index: 1000; /* Above everything */
}
```

This allows your website to remain fully functional while the desktop environment floats on top.

## Customization

### Styling Windows

```css
.window {
    /* Custom window appearance */
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
}

.window-title-bar {
    background: linear-gradient(to bottom, #333, #222);
    color: #fff;
}
```

### Terminal Colors

```css
.terminal-body {
    background-color: rgba(0, 0, 0, 0.95);
    color: #00ff00; /* Classic green */
}

.terminal-prompt {
    color: #00ff00;
    margin-right: 8px; /* Important: prevents text wiggle */
}
```

### Taskbar Styling

```css
#taskbar {
    background: rgba(0, 0, 0, 0.95);
    border-top: 1px solid #333;
}

.taskbar-button {
    background: transparent;
    color: #fff;
}
```

## Terminal Commands

Full list of supported commands:

### File System
`ls`, `cd`, `pwd`, `cat`, `touch`, `mkdir`, `rm`, `cp`, `mv`, `find`, `grep`

### System
`whoami`, `hostname`, `uname`, `ps`, `top`, `kill`, `history`, `clear`

### Network
`ping`, `ssh`, `traceroute`, `nmap`, `netstat`, `ifconfig`, `wget`, `curl`

### User Management
`su`, `sudo`, `useradd`, `passwd`, `exit`

### Text Processing
`more`, `less`, `head`, `tail`, `wc`, `sort`, `echo`

### Utilities
`help`, `which`, `env`, `export`, `date`, `cal`, `uptime`

## API Reference

### Initialize Desktop

```javascript
import { initDesktop } from './js/desktop-init.js';

// Call after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initDesktop();
});
```

### Create Windows Programmatically

```javascript
import { createWindow } from './js/main.js';

const myWindow = createWindow('my-id', 'Window Title', '<p>Content</p>', {
    width: 600,
    height: 400,
    x: 100,
    y: 100,
    resizable: true,
    maximizable: true
});
```

### Launch Applications

```javascript
import { createNewTerminalWindow } from './js/new_terminal.js';

// Open a terminal window
createNewTerminalWindow();
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires ES6 module support.

## Advanced Usage

### Adding Custom Applications

1. Create your app module:

```javascript
// js/my-app.js
import { createWindow } from './main.js';

export function createMyApp() {
    const content = `
        <div style="padding: 20px;">
            <h2>My Custom App</h2>
            <p>Hello from my app!</p>
        </div>
    `;

    return createWindow('my-app', 'My App', content, {
        width: 500,
        height: 300
    });
}
```

2. Add to start menu (in your HTML):

```html
<div class="start-menu-item" data-app="my-app">
    <span>📱 My App</span>
</div>
```

3. Register in start_menu.js:

```javascript
import { createMyApp } from './my-app.js';

// Add to switch statement
case 'my-app':
    createMyApp();
    break;
```

### Customizing Music Playlist

Edit the playlist array in `js/music_player.js`:

```javascript
const playlist = [
    { title: 'My Song', file: 'demo/music/my-song.mp3' },
    { title: 'Another Track', file: 'demo/music/track2.mp3' }
];
```

### Accessing Window Manager

```javascript
import { openWindows, setActiveWindow } from './js/main.js';

// Get all open windows
console.log(openWindows);

// Focus specific window
setActiveWindow('terminal');
```

## Important CSS Notes

### Preventing Text Wiggle in Terminal

The terminal uses precise spacing to prevent text from shifting when typing. **Do not modify** these values:

```css
.terminal-prompt {
    margin-right: 8px; /* Critical - prevents horizontal wiggle */
}

.terminal-input {
    margin-bottom: 0px; /* Critical - prevents vertical wiggle */
}
```

### Z-Index Hierarchy

```
10000  = Start menu (must be on top)
1001   = Calendar popup
1000   = Taskbar, Windows
999    = Desktop container
1      = Matrix canvas
```

## Troubleshooting

**Windows not draggable?**
- Ensure overlay-mode.css is included
- Check that event listeners are on `document` not `desktop`

**Start menu not appearing?**
- Check z-index in overlay-mode.css
- Verify initDesktop() is only called once

**Music player opens minimized?**
- This is fixed in music_player.js with setTimeout

**Calendar cut off by taskbar?**
- Set `bottom: 40px` in overlay-mode.css for #calendar-popup

**Matrix effect blocking clicks?**
- Ensure `pointer-events: none` on #background-canvas

## License

Open Source GNU GPLv3 - please credit brainphreak.net

## Support

For issues, questions, or contributions, contact brainphreak@brainphreak.net
