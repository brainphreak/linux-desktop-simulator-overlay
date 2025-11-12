# Overlay Desktop Environment

A complete web-based desktop environment that floats over your existing website content. Features draggable windows, taskbar, music player, calendar, matrix rain effect, and a full Linux terminal emulator.

## Live Demo

Open `demo/overlay-mode.html` to see it in action!

See it live at www.brainphreak.net 

🌐 **Live Site:** [brainphreak.net](https://brainphreak.net)

![brainphreak.net Screenshot](images/brainphreak.net.png)

## Table of Contents

- [Core Desktop Experience](#core-desktop-experience)
- [Integrated Applications](#integrated-applications)
- [Projects Showcase](#projects-showcase)
- [Articles & Content](#articles--content)
- [Linux Terminal Simulator](#linux-terminal-simulator)
- [Technology Stack](#technology-stack)
- [Performance & Optimization](#performance--optimization)
- [Easter Eggs & Hidden Features](#easter-eggs--hidden-features)
- [Browser Compatibility](#browser-compatibility)
- [Installation & Usage](#installation--usage)

## Core Desktop Experience

### Full Desktop Interface
- **Advanced Window Management**
  - Drag windows by title bar with smooth positioning
  - Resize from all 8 edges and corners
  - Minimize to taskbar and restore functionality
  - Maximize to full screen with state preservation
  - Window focus management with z-index stacking
  - Taskbar buttons for quick window access

### Hierarchical Start Menu
- Multi-level navigation system with hover-activated submenus

### System Tray
- Live clock with real-time updates
- Calendar popup with date navigation
- Matrix background toggle for hacker aesthetic
- Music player quick access

### Visual Themes
- Classic green-on-black terminal aesthetic (#00ff00 on #000000)
- Matrix-style animated background effect
- 90s-style window chrome with gradients and borders

## Integrated Applications

### Utilities

#### Linux Terminal Emulator
A fully-featured terminal with 90+ commands including:
- Complete file operations and directory navigation
- SSH simulation with persistent sessions and easter eggs
- Network tools (nmap, ping, traceroute, tcpdump, netstat, curl, wget)
- Password cracking (john, hashcat with wordlists)
- WiFi hacking tools (iwconfig, airodump-ng, aircrack-ng)
- Command piping and output redirection
- Multi-user system with su/sudo authentication
- Tab completion and command history
- See [Linux Terminal Simulator](#linux-terminal-simulator) section for full details

#### Music Player
WinAmp-style player with:
- 8-track curated playlist (edIT, The Algorithm, Master Boot Record, Igorrr)
- Animated visualizer with 10 frequency bars using Web Audio API
- Play/pause/stop/next/previous controls
- Shuffle and repeat modes
- Seek bar with click-to-position
- Collapsible playlist view

#### Other Utilities
- **Calendar:** Interactive monthly calendar with date navigation
- **Calculator:** Standard calculator with keyboard and mouse input


## Linux Terminal Simulator

### Core Terminal Features
- **Virtual Filesystem:** Complete directory structure with /home, /etc, /usr/bin, /var, and more
- **Multi-User System:** Switch between users with su/sudo, persistent user sessions
- **Command History:** Arrow keys to navigate through command history (per-user)
- **Tab Completion:** Auto-complete commands and file paths
- **Environment Variables:** PATH, HOME, USER, CWD, OLDPWD support
- **Piping:** Chain commands together using pipes (|)
- **Output Redirection:** Redirect output with > and >>
- **SSH Simulation:** Connect to remote hosts with persistent sessions
- **Interactive Commands:** Commands like more, less, top with keyboard navigation
- **Ctrl+C Support:** Interrupt long-running commands

## File Operations

- `ls` - List directory contents (-l for long format, -a for hidden files)
- `cd` - Change directory (supports ~, .., -, absolute/relative paths)
- `pwd` - Print working directory
- `cat` - Display file contents (supports piping)
- `head` - Show first N lines (-n flag, default 10)
- `tail` - Show last N lines (-n flag, default 10)
- `more` - Paginate file contents (space for next page, q to quit)
- `less` - Enhanced pager (currently aliases to more)
- `touch` - Create empty files
- `find` - Search for files (-name pattern, -type f/d)
- `grep` - Search file contents with regex patterns (supports piping)
- `chmod` - Change file permissions (simulated)
- `chown` - Change file ownership (simulated)
- `tar` - Create/extract archives (-czf to create, -xzf to extract, -v for verbose)
- `gzip` - Compress/decompress files (-d to decompress)

## Network Tools

- `ping` - Test network connectivity with realistic RTT and packet loss
- `nmap` - Port scanner with service detection (-p for ports, -sV for services)
- `traceroute` - Trace network path to destination
- `tcpdump` - Network packet analyzer
- `ssh` - Secure shell to remote hosts (creates persistent sessions)
- `scp` - Secure copy files between hosts
- `curl` - Transfer data from URLs (-I for headers, -o for output file)
- `wget` - Download files with animated progress bar (-O for output)
- `nc` - Netcat for port scanning (-zv), listening (-l -p), and banner grabbing
- `telnet` - Connect to services and view banners
- `ifconfig` - Display network interface configuration (shows eth0, lo, wlan0)
- `netstat` - Show network connections (dynamic based on activity)
- `route` - Display routing table
- `whois` - Domain registration information lookup
- `nslookup` - DNS query tool
- `dig` - Advanced DNS lookup (A, AAAA, MX, NS, TXT, SOA records)
- `host` - Simple DNS lookup (-t for record type)
- `arp` - View ARP table with MAC addresses
- `iptables` - Firewall configuration (simulated)

## Wireless Tools

- `iwconfig` - Display wireless network interface configuration
- `airodump-ng` - WiFi packet capture tool for WPA2 handshake collection
  - Full-screen real-time display with live beacon/data counters
  - `-w prefix` - Write capture file (required for handshake capture)
  - `-c channel` - Target specific channel
  - `--bssid MAC` - Filter by specific access point
  - Automatically captures WPA2 handshakes from networks with clients
  - Shows handshake capture indicator: `[ WPA handshake: BSSID ]`
  - Press Ctrl+C to stop and save capture file
- `aircrack-ng` - WPA/WPA2 password cracker using dictionary attacks
  - `-w wordlist` - Specify wordlist file (e.g., /usr/share/wordlists/common.txt)
  - `-b bssid` - Target specific access point
  - `-e essid` - Target specific network name
  - Cracks WiFi passwords from captured handshake files
  - Shows real-time progress and key when found

## Available WiFi Networks

| ESSID | BSSID | Channel | Password | Has Clients |
|-------|-------|---------|----------|-------------|
| SecureNet-5G | 00:14:6C:7E:40:80 | 36 | securenet123 | No |
| HomeNetwork | A4:08:F5:2D:39:E1 | 6 | password123 | Yes |
| CoffeeShop | C8:3A:35:B0:24:68 | 11 | coffeeshop | No |
| Guest_WiFi | F4:EC:38:D1:5A:7C | 1 | guestwifi | Yes |

## Security & Hacking Tools

- `john` - John the Ripper password cracker
  - `--wordlist=FILE` - Use wordlist for dictionary attack (required)
  - `--show` - Display previously cracked passwords
  - Cracks /etc/shadow format with SHA-512 hashes
  - Animated progress with realistic speed metrics
  - Wordlist: /usr/share/wordlists/common.txt (600+ passwords)
  - Supports Ctrl+C to abort cracking
- `hashcat` - GPU-based password cracker (simulates dictionary attacks)
- `strings` - Extract printable strings from binaries (includes hidden flags)
- `base64` - Encode/decode base64 (-d to decode)
- `md5sum` - Calculate MD5 hashes of files
- `sha256sum` - Calculate SHA256 hashes of files
- `openssl` - Cryptography toolkit
  - `openssl version` - Show version (-a for all info)
  - `openssl rand` - Generate random data (-hex, -base64)
  - `openssl s_client` - SSL/TLS client (-connect host:port)
  - `openssl passwd` - Generate password hashes
  - `openssl base64` - Base64 encoding/decoding

## System Information

- `whoami` - Display current username
- `hostname` - Show system hostname
- `uname` - Print system information (-a for all)
- `date` - Display current date and time
- `w` - Show who is logged in and what they're doing
- `who` - Display logged-in users
- `ps` - List running processes
- `top` - Interactive process viewer (P for CPU sort, M for memory, N for PID, R to refresh, q to quit)
- `history` - View command history

## User Management

- `su` - Switch user (requires password authentication)
- `sudo` - Execute commands as root
- `useradd` - Add new users (root only, -p for password)
- `exit` - Exit current user session or close terminal

## Package Management

- `apt` - Debian package manager (install, update, upgrade, remove)
- `dpkg` - Low-level package manager (-l to list, -i to install)

## Other Utilities

- `echo` - Display text or variables
- `clear` - Clear terminal screen
- `export` - Set environment variables
- `env` - Display all environment variables
- `bash` - Start new bash shell
- `which` - Locate command executables in PATH
- `help` - Display available commands

## Advanced Features

### Piping Examples

```bash
# View large file with pagination
cat /etc/passwd | more

# Search and paginate
ls -la | grep "txt" | more

# Get first 5 lines
cat file.txt | head -5

# Search and show last matches
cat log.txt | grep "error" | tail -10

# Complex pipeline
ls -la | grep "\\.txt" | head -20 | grep "user"

# Pipe network output
nmap google.com | grep "open"

# With output redirection
cat file.txt | grep "pattern" > output.txt
```

### SSH Features

- **Persistent Sessions:** SSH connections maintain separate filesystem state
- **Hidden Files:** Each SSH target contains unique hidden files with sensitive data
- **Easter Eggs:** Special files on hostname-specific servers:
  - **gibson:** .wargames, HACK_THE_PLANET.txt
  - **matrix:** .red_pill, .rabbit_hole
  - **fsociety/ecorp:** .fsociety.dat, wellick_notes.txt
- **Exposed Secrets:** Find .env files, .passwords.txt, shadow.bak, .bash_history with sensitive commands

### DNS & Network Simulation

- **Consistent IPs:** Hostnames resolve to the same IP every time using hash-based generation
- **DNS Cache:** Recently queried domains are cached and appear in netstat/arp
- **Service Detection:** nmap and nc detect realistic service banners
- **Well-Known Hosts:** google.com, github.com, stackoverflow.com have realistic public IPs

### Password Cracking Simulation

- **john:** Cracks shadow file format with common passwords (123456, password, admin, letmein, etc.)
- **hashcat:** Simulates GPU cracking with OpenCL detection and rockyou.txt dictionary
- **Realistic Output:** Animated progress with speed metrics and statistics

## File System Structure

```
/
├── home/
│   ├── root/          (root user home)
│   ├── user/          (regular user)
│   └── brainphreak/   (main user)
├── etc/
│   ├── hosts          (hostname to IP mappings)
│   ├── passwd         (user accounts)
│   ├── shadow         (password hashes)
│   └── sudoers        (sudo permissions)
├── usr/
│   ├── bin/           (executables)
│   └── share/         (shared data)
├── var/
│   └── log/           (system logs)
├── tmp/               (temporary files)
└── bin/               (essential binaries)
```

## Default Users & Passwords

| Username | Password | Permissions | Notes |
|----------|----------|-------------|-------|
| user | 123456 | Sudo access | Default login, can crack with john |
| brainphreak | letmein | Sudo access | Can crack with john |
| root | password | Full access | Can crack with john |

*All passwords are in /usr/share/wordlists/common.txt and can be cracked from /etc/shadow using john*

## Tips & Tricks

- **Tab Completion:** Press Tab to auto-complete commands and file paths
- **Command History:** Use Up/Down arrows to cycle through previous commands
- **Interrupt:** Press Ctrl+C to stop running commands like ping, wget, john, hashcat
- **Hidden Files:** Use `ls -a` to view hidden files (starting with .)
- **Variables:** Use $USER, $HOME, $PATH in commands
- **Change Directory:** Use `cd -` to go back to previous directory
- **Home Shortcut:** Use `cd ~` or just `cd` to go home
- **SSH Exploration:** Try ssh to different hostnames to find easter eggs
- **Password Cracking:** SSH to servers, find shadow files, use john/hashcat to crack

## Example Workflow: Hack a Server

```bash
# 1. Scan for open SSH port
nmap -p 22 target.com

# 2. Connect via SSH
ssh admin@target.com

# 3. Look for hidden files
ls -la

# 4. Find password files
cat .passwords.txt
cat shadow.bak

# 5. Download the shadow file (exit SSH first)
exit
scp admin@target.com:shadow.bak ./

# 6. Crack passwords with wordlist
john --wordlist=/usr/share/wordlists/common.txt /etc/shadow

# 7. View cracked passwords
john --show /etc/shadow

# 8. Login as root with cracked password
su root
```

## Example Workflow: Crack WiFi Password

```bash
# 1. Check wireless interface
iwconfig

# 2. Scan for WiFi networks
sudo airodump-ng wlan0

# 3. Target specific network and capture handshake
sudo airodump-ng -w capture --bssid A4:08:F5:2D:39:E1 wlan0

# 4. Wait for handshake capture (shows: [ WPA handshake: A4:08:F5:2D:39:E1 ])
# Press Ctrl+C when handshake is captured

# 5. Crack the WiFi password
aircrack-ng -w /usr/share/wordlists/common.txt capture-01.cap

# 6. WiFi password found: password123
```

## Technology Stack

### Frontend Architecture
- **Zero Framework Approach:** Pure vanilla HTML5, CSS3, and JavaScript (ES6+)
- **Modular Design:** ES6 modules for clean separation of concerns
  - `main.js` - Window management and desktop core
  - `start_menu.js` - Menu system and navigation
  - `taskbar.js` - Taskbar and system tray functionality
  - `terminal_commands.js` - Terminal command implementations (4000+ lines)
  - `terminal_filesystem.js` - Virtual filesystem structure
  - `music_player.js` - Audio player with visualizer
  - `calendar.js` - Interactive calendar popup
  - Individual modules for each project/article window
- **No External Dependencies:** All functionality built from scratch

### Terminal Implementation
- **Language:** Vanilla JavaScript (ES6 modules)
- **Architecture:** Command pattern with async/await for all commands
- **Filesystem:** In-memory JSON structure with full POSIX-like paths
- **Persistence:** Command history saved per-user, DNS cache maintained globally
- **Determinism:** Hash-based pseudo-random generation for consistent IPs and data
- **DOM Manipulation:** Direct DOM updates for interactive commands

### Design System
- **Color Scheme:** Green-on-black terminal aesthetic (#00ff00 on #000000)
- **Typography:** Monospace fonts (Courier New, Courier) for authentic terminal feel
- **Window Chrome:** Classic 90s-style window decorations with gradients and borders
- **GitHub-Style Content:** Markdown-inspired styling for documentation windows
- **Responsive Layout:** Adapts to different screen sizes while maintaining desktop metaphor

### Advanced Features
- **Canvas Animation:** Matrix rain effect with configurable character sets
- **Audio Processing:** Web Audio API for music visualizer with FFT analysis
- **Local Storage:** Persistent settings and command history
- **Event Handling:** Custom event system for inter-component communication
- **State Management:** Global state for window focus, active applications

## Performance & Optimization
- **Lightweight:** No heavy frameworks or libraries, minimal bundle size
- **Lazy Loading:** Windows and content loaded on-demand
- **Efficient DOM Updates:** Minimal reflows and repaints
- **RequestAnimationFrame:** Smooth animations at 60fps
- **Memory Management:** Proper cleanup when windows close

## Easter Eggs & Hidden Features
- **SSH Easter Eggs:** Hidden files on specific hostnames (gibson, matrix, fsociety, ecorp)
  - gibson: .wargames, HACK_THE_PLANET.txt
  - matrix: .red_pill, .rabbit_hole
  - fsociety/ecorp: .fsociety.dat, wellick_notes.txt
- **Terminal Secrets:** .garbage file and other hidden data in home directories
- **Command Flags:** Hidden flags in strings command output (FLAG{strings_are_fun})
- **Password Cracking:** Crack /etc/shadow with john to discover root password is "password"
- **WiFi Hacking:** Capture WPA2 handshakes and crack WiFi passwords with aircrack-ng
- **Wordlist Location:** Pre-populated wordlist at /usr/share/wordlists/common.txt with 600+ passwords
- **Matrix Theme:** Toggle animated background for different visual experience
- **Music Selection:** Curated glitch-hop and experimental electronic tracks
- **Exposed Secrets:** Find .env files, .passwords.txt, shadow.bak, .bash_history on SSH servers

## Browser Compatibility
- **Chrome/Edge:** Full support with optimal performance
- **Firefox:** Full support
- **Safari:** Full support with Web Audio API for music features
- **Mobile:** Touch support for window dragging and menu navigation

## Installation & Usage

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/brainphreak.git
   cd brainphreak
   ```

2. **Serve the files**

   Since this uses ES6 modules, you need a local web server. Choose one:

   **Python:**
   ```bash
   python -m http.server 8000
   ```

   **Node.js (http-server):**
   ```bash
   npx http-server -p 8000
   ```

   **PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### File Structure
```
brainphreak/
├── index.html              # Main entry point
├── css/
│   └── style.css          # All styling
├── js/
│   ├── main.js            # Window management
│   ├── start_menu.js      # Start menu system
│   ├── taskbar.js         # Taskbar and system tray
│   ├── terminal_commands.js    # Terminal commands
│   ├── terminal_filesystem.js  # Virtual filesystem
│   ├── music_player.js    # Music player
│   ├── calendar.js        # Calendar widget
│   ├── new_terminal.js    # Terminal UI
│   └── [project_windows].js   # Individual project pages
├── images/                # Image assets
├── music/                 # Audio files for music player
└── README.md             # This file
```

### Getting Started

1. Click the **Start Menu** button in the bottom-left corner
2. Navigate through **Information**, **Projects**, **Articles**, **Music**, or **Utilities**
3. Open the **Terminal** from Utilities → Terminal
4. Type `help` to see all available commands
5. Try the example workflows in the terminal documentation
6. Toggle the **Matrix background** from the system tray
7. Play music from the **Music Player** in the system tray

### Terminal Quick Start

```bash
# View available commands
help

# Navigate the filesystem
ls -la
cd /etc
cat passwd

# Try SSH to find easter eggs
ssh admin@gibson
ls -la

# Crack passwords
john --wordlist=/usr/share/wordlists/common.txt /etc/shadow
john --show /etc/shadow

# Scan networks
nmap google.com
ping github.com

# Hack WiFi
sudo airodump-ng wlan0
sudo airodump-ng -w capture --bssid A4:08:F5:2D:39:E1 wlan0
aircrack-ng -w /usr/share/wordlists/common.txt capture-01.cap
```

## Development Philosophy
- **Nostalgia Meets Modern:** Classic desktop UI with contemporary web standards
- **Educational Value:** Terminal teaches Linux commands and cybersecurity concepts
- **Portfolio Showcase:** Interactive way to present projects and skills
- **Technical Challenge:** Building complex UI without frameworks demonstrates deep JavaScript knowledge
- **Attention to Detail:** Realistic command output, authentic terminal behavior, accurate simulations

## Future Enhancements
- Additional terminal commands and tools
- More SSH target hosts with unique content
- Expanded music playlist and player features
- Additional desktop themes and color schemes
- File upload/download functionality
- Network between multiple terminal sessions
- More interactive games and applications
- Notepad/text editor application
- File manager GUI



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

## Contact

**brainphreak** - [brainphreak.net](https://brainphreak.net)

Project Link: [https://github.com/yourusername/brainphreak](https://github.com/yourusername/brainphreak)

