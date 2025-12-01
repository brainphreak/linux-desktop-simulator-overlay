# Linux Desktop Simulator Overlay

A portable desktop simulation overlay that adds a draggable terminal, music player, taskbar, and matrix rain effect to any existing website. All components float above your page content.

![Terminal Kit](https://img.shields.io/badge/version-1.0.0-green) ![License](https://img.shields.io/badge/license-GPLv3-blue)

## Live Demo

Open `demo/index.html` to see it in action!

**Live Site:** [theblackpacket.com](https://theblackpacket.com)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F2F35TO7X)

## What It Does

This overlay adds a complete "hacker desktop" experience on top of any website:
- Floating, draggable windows (terminal + music player)
- A taskbar at the bottom of the screen
- Matrix rain background effect
- All components use fixed positioning and overlay your existing content

## Features

- **Interactive Terminal** - Full Linux-like terminal with 70+ commands
- **Music Player** - Draggable music player with playlist support
- **Taskbar** - Windows-style taskbar with window management
- **Matrix Rain** - Iconic falling green characters background effect
- **Overlay Design** - Floats above your existing website content
- **Mobile Support** - Fully responsive with touch-friendly mobile terminal
- **Easter Eggs** - Hidden hacking challenges and movie references

## Quick Start

### 1. Include the CSS

```html
<link rel="stylesheet" href="terminal-kit/terminal-kit.css">
```

### 2. Import and Initialize

```html
<script type="module">
    import { TerminalKit } from './terminal-kit/index.js';

    TerminalKit.init();
</script>
```

That's it! You'll have a fully functional terminal with taskbar, music player, and matrix rain.

## Installation

### Option 1: Direct Download

1. Download the `src/` folder
2. Rename it to `terminal-kit/`
3. Place it in your project root
4. Include the CSS and JS as shown above

### Option 2: Clone Repository

```bash
git clone https://github.com/brainphreak/linux-desktop-simulator-overlay.git
```

## Configuration Options

### Full Configuration Example

```javascript
TerminalKit.init({
    // Enable/disable features
    terminal: true,
    musicPlayer: true,
    taskbar: true,
    matrixRain: true,

    // Terminal options
    terminalOptions: {
        x: 100,           // Initial X position
        y: 80,            // Initial Y position
        width: 700,       // Window width
        height: 450,      // Window height
        autoShow: true    // Show on load
    },

    // Music player options
    musicPlayerOptions: {
        x: 150,           // Initial X position
        y: 150,           // Initial Y position
        autoShow: false   // Hidden by default
    },

    // Matrix rain options
    matrixOptions: {
        containerId: 'matrixRain',  // Container element ID
        autoStart: true             // Start automatically
    },

    // Custom playlist
    playlist: [
        { title: "Song 1", src: "/mp3/song1.mp3" },
        { title: "Song 2", src: "/mp3/song2.mp3" }
    ]
});
```

### Minimal Configuration (Terminal Only)

```javascript
TerminalKit.init({
    terminal: true,
    musicPlayer: false,
    taskbar: false,
    matrixRain: false
});
```

### Auto-Initialization

You can also use the `data-auto-init` attribute:

```html
<script type="module" src="terminal-kit/index.js" data-auto-init></script>
```

Or with custom config:

```html
<script type="module"
        src="terminal-kit/index.js"
        data-auto-init='{"matrixRain": false}'>
</script>
```

## API Reference

### TerminalKit Object

```javascript
// Initialization
TerminalKit.init(config)           // Initialize with optional config
TerminalKit.isInitialized()        // Check if initialized
TerminalKit.getConfig()            // Get current configuration

// Terminal Controls
TerminalKit.showTerminal()         // Show terminal window
TerminalKit.hideTerminal()         // Hide terminal window
TerminalKit.toggleTerminal()       // Toggle terminal visibility
TerminalKit.isTerminalVisible()    // Check if terminal is visible

// Music Player Controls
TerminalKit.showMusicPlayer()      // Show music player
TerminalKit.hideMusicPlayer()      // Hide music player
TerminalKit.toggleMusicPlayer()    // Toggle music player visibility
TerminalKit.isMusicPlayerVisible() // Check if music player is visible
TerminalKit.setPlaylist(songs)     // Update playlist

// Taskbar Controls
TerminalKit.showTaskbar()          // Show taskbar
TerminalKit.hideTaskbar()          // Hide taskbar

// Matrix Rain Controls
TerminalKit.startMatrixRain()      // Start matrix effect
TerminalKit.stopMatrixRain()       // Stop matrix effect
TerminalKit.toggleMatrixRain()     // Toggle matrix effect
TerminalKit.isMatrixRunning()      // Check if matrix is running
```

## File Structure

```
terminal-kit/
├── index.js           # Main entry point and public API
├── terminal.js        # Terminal window and command processing
├── commands.js        # All command implementations
├── filesystem.js      # Virtual filesystem
├── music-player.js    # Music player component
├── taskbar.js         # Taskbar component
├── matrix-rain.js     # Matrix rain effect
└── terminal-kit.css   # All styles
```

## Desktop vs Mobile

Terminal Kit automatically detects the device and provides an optimized experience:

### Desktop
- Draggable, resizable windows
- Keyboard shortcuts
- Multi-window support with z-index management
- Traditional command input

### Mobile
- Full-screen terminal overlay
- Touch-friendly interface
- On-screen Ctrl+C button for interrupting commands
- Responsive layout
- Tab completion support
- Command history with swipe gestures

## Taskbar Features

The taskbar provides quick access to all features:

- **Terminal Button** - Toggle terminal window
- **Music Button** - Toggle music player
- **Matrix Button** - Toggle matrix rain effect
- **Clock** - Current time display

## Music Player Features

- Playlist support with multiple tracks
- Play/Pause, Next, Previous controls
- Volume control with slider
- Progress bar with seek functionality
- Track title display
- Draggable window
- Minimize/Close buttons

## Persistence

Terminal Kit automatically saves:
- Window visibility states
- Current directory
- Command history
- User sessions (for SSH simulation)

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile Safari (iOS 13+)
- Chrome for Android

## Dependencies

None! Terminal Kit is completely standalone with no external dependencies.

## How the Overlay Works

When initialized, Terminal Kit creates:

1. **Matrix Rain Canvas** - Full-screen canvas behind all content (z-index: 1)
2. **Terminal Window** - Floating, draggable window (z-index: 10000+)
3. **Music Player** - Floating, draggable window (z-index: 10000+)
4. **Taskbar** - Fixed position bar at bottom (z-index: 10000+)

All components use `position: fixed` so they overlay your existing page content without affecting layout.

### Adding to an Existing Website

Simply include the CSS and JS on any page:

```html
<!-- Your existing website -->
<div class="my-content">
    <h1>My Website</h1>
    <p>Content here...</p>
</div>

<!-- Add the overlay -->
<link rel="stylesheet" href="terminal-kit/terminal-kit.css">
<script type="module">
    import { TerminalKit } from './terminal-kit/index.js';
    TerminalKit.init();
</script>
```

The terminal, taskbar, and music player will appear floating above your content.

## Related Projects

- [Hacking Terminal Simulator](https://github.com/brainphreak/hacking-terminal-simulator) - Embedded version that integrates directly into a page (no floating windows)

## Related Documentation

- [COMMANDS.md](COMMANDS.md) - Complete command reference
- [EASTER-EGGS.md](EASTER-EGGS.md) - Hidden features and hacking challenges

## License

This project is licensed under the GPLv3 License - see the LICENSE file for details.

## Credits

Created by [The Black Packet](https://theblackpacket.com) - A cybersecurity collective.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
