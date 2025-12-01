/* ============================================================================
   TERMINAL KIT - Music Player Module
   Adapted from brainphreak.net for theblackpacket
   ============================================================================ */

// ============================================================================
// MUSIC PLAYER STATE
// ============================================================================

let playerWindow = null;
let audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// DOM element references
let visualizer = null;
let playerPlaylist = null;
let currentSongEl = null;
let songTimeEl = null;
let seekBar = null;
let shuffleBtn = null;
let repeatBtn = null;
let playlistToggleBtn = null;

let visualizerInterval = null;
let seeking = false;

// Dragging state
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// ============================================================================
// LOCALSTORAGE PERSISTENCE
// ============================================================================

const STORAGE_KEY = 'tk-music-player-state';

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
    if (!playerWindow) return;
    try {
        const state = {
            x: parseInt(playerWindow.style.left) || 150,
            y: parseInt(playerWindow.style.top) || 150,
            visible: !playerWindow.classList.contains('tk-hidden')
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        // Ignore storage errors
    }
}

// Playlist - can be set via setPlaylist() before createMusicPlayer()
let playlist = [
    { title: "Twenty Minutes - edIT", src: "/mp3/01 - edIT - Twenty Minutes.mp3" },
    { title: "Access Granted - The Alg0rithm", src: "/mp3/02 - The Alg0rithm - Access Granted.mp3" },
    { title: "MSDOS.SYS - Master Boot Record", src: "/mp3/03 - Master Boot Record - MSDOS.SYS.mp3" },
    { title: "Tendon - Igorrr", src: "/mp3/04- Igorrr - Tendon.mp3" },
    { title: "Dex - edIT", src: "/mp3/05 - edIT - Dex.mp3" },
    { title: "Tr0jans - The Alg0rithm", src: "/mp3/06 - The Alg0rithm - Trojans.mp3" },
    { title: "CONFIG.SYS - Master Boot Record", src: "/mp3/07 - Master Boot Record - CONFIG.SYS.mp3" },
    { title: "Excessive Funeral - Igorrr", src: "/mp3/08 - Igorrr - Excessive Funeral.mp3" }
];

// Set a custom playlist (call before createMusicPlayer)
export function setPlaylist(newPlaylist) {
    if (Array.isArray(newPlaylist) && newPlaylist.length > 0) {
        playlist = newPlaylist;
        currentSongIndex = 0;

        // If player already exists, refresh the playlist display
        if (playerPlaylist) {
            populatePlaylist();
            updateSongDisplay();
        }
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60) || 0;
    const s = Math.floor(secs - m * 60) || 0;
    return `${m}:${String(s).padStart(2, '0')}`;
}

// ============================================================================
// VISUALIZER
// ============================================================================

function startVisualizer() {
    stopVisualizer();
    visualizerInterval = setInterval(() => {
        if (!visualizer) return;
        const bars = visualizer.getElementsByClassName('tk-visualizer-bar');
        for (let i = 0; i < bars.length; i++) {
            const height = Math.floor(Math.random() * 100);
            bars[i].style.height = `${height}%`;
        }
    }, 100);
}

function stopVisualizer() {
    if (visualizerInterval) {
        clearInterval(visualizerInterval);
        visualizerInterval = null;
    }
    if (visualizer) {
        const bars = visualizer.getElementsByClassName('tk-visualizer-bar');
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.height = '0%';
        }
    }
}

// ============================================================================
// PLAYLIST MANAGEMENT
// ============================================================================

function populatePlaylist() {
    if (!playerPlaylist) return;

    playerPlaylist.innerHTML = '';
    playlist.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'tk-playlist-item';
        if (index === currentSongIndex) {
            item.classList.add('active');
        }
        item.textContent = `[${(index + 1).toString().padStart(2, '0')}] ${song.title}`;
        item.addEventListener('click', async () => {
            currentSongIndex = index;
            await loadSong(currentSongIndex);
            playSong();
        });
        playerPlaylist.appendChild(item);
    });
}

// ============================================================================
// AUDIO CONTROLS
// ============================================================================

function loadSong(index) {
    const song = playlist[index];
    if (!song) return Promise.reject('Invalid song index');

    audio.src = song.src;
    if (currentSongEl) {
        currentSongEl.textContent = song.title;
    }
    populatePlaylist();

    return new Promise((resolve, reject) => {
        const onCanPlay = () => {
            audio.removeEventListener('canplaythrough', onCanPlay);
            audio.removeEventListener('error', onError);
            resolve();
        };

        const onError = (error) => {
            audio.removeEventListener('canplaythrough', onCanPlay);
            audio.removeEventListener('error', onError);
            reject(error);
        };

        if (audio.readyState >= 3) {
            resolve();
        } else {
            audio.addEventListener('canplaythrough', onCanPlay, { once: true });
            audio.addEventListener('error', onError, { once: true });
        }
    });
}

function playSong() {
    isPlaying = true;
    audio.play().then(() => {
        startVisualizer();
    }).catch(error => {
        console.error("Error playing audio:", error);
        if (currentSongEl) {
            currentSongEl.textContent = "Error playing file";
        }
        isPlaying = false;
    });
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    stopVisualizer();
}

function stopSong() {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    if (songTimeEl) {
        songTimeEl.textContent = "0:00 / 0:00";
    }
    if (seekBar) {
        seekBar.value = 0;
    }
    stopVisualizer();
}

async function nextTrack() {
    if (isShuffle && playlist.length > 1) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentSongIndex);
        currentSongIndex = newIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
    }

    try {
        await loadSong(currentSongIndex);
        playSong();
    } catch (error) {
        console.error("Error loading next track:", error);
    }
}

async function prevTrack() {
    if (isShuffle && playlist.length > 1) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentSongIndex);
        currentSongIndex = newIndex;
    } else {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    }

    try {
        await loadSong(currentSongIndex);
        playSong();
    } catch (error) {
        console.error("Error loading previous track:", error);
    }
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    if (shuffleBtn) {
        shuffleBtn.classList.toggle('active', isShuffle);
    }
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    if (repeatBtn) {
        repeatBtn.classList.toggle('active', isRepeat);
    }
}

function togglePlaylist() {
    if (playerPlaylist && playerWindow) {
        const isVisible = playerPlaylist.style.display === 'block';
        if (isVisible) {
            playerPlaylist.style.display = 'none';
        } else {
            // Position playlist below the music player
            const rect = playerWindow.getBoundingClientRect();
            playerPlaylist.style.left = rect.left + 'px';
            playerPlaylist.style.top = rect.bottom + 'px';
            playerPlaylist.style.width = rect.width + 'px';
            playerPlaylist.style.display = 'block';
        }
    }
}

// ============================================================================
// MUSIC PLAYER CREATION
// ============================================================================

export function createMusicPlayer(options = {}) {
    const {
        x = 150,
        y = 150,
        onClose = null,
        onMinimize = null
    } = options;

    // Load saved state from localStorage, fallback to options
    const savedState = loadSavedState();
    const initialX = savedState?.x ?? x;
    const initialY = savedState?.y ?? y;

    // Create player window
    playerWindow = document.createElement('div');
    playerWindow.id = 'tk-music-player';
    playerWindow.className = 'tk-window tk-music-player';
    playerWindow.style.left = `${initialX}px`;
    playerWindow.style.top = `${initialY}px`;

    // Create title bar
    const titleBar = document.createElement('div');
    titleBar.className = 'tk-window-title-bar';

    const title = document.createElement('span');
    title.textContent = 'Music Player v2.0';

    const controls = document.createElement('div');
    controls.className = 'tk-window-controls';

    const minimizeBtn = document.createElement('div');
    minimizeBtn.className = 'tk-window-btn minimize';
    minimizeBtn.onclick = (e) => {
        e.stopPropagation();
        hideMusicPlayer();
        if (onMinimize) onMinimize();
    };

    playlistToggleBtn = document.createElement('div');
    playlistToggleBtn.className = 'tk-window-btn playlist-toggle';
    playlistToggleBtn.onclick = (e) => {
        e.stopPropagation();
        togglePlaylist();
    };

    const closeBtn = document.createElement('div');
    closeBtn.className = 'tk-window-btn close';
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        stopSong();
        hideMusicPlayer();
        if (onClose) onClose();
    };

    controls.appendChild(minimizeBtn);
    controls.appendChild(playlistToggleBtn);
    controls.appendChild(closeBtn);

    titleBar.appendChild(title);
    titleBar.appendChild(controls);

    // Create player body
    const playerBody = document.createElement('div');
    playerBody.className = 'tk-player-body';

    // Display section
    const display = document.createElement('div');
    display.className = 'tk-player-display';

    const songInfo = document.createElement('div');
    songInfo.className = 'tk-player-song-info';

    currentSongEl = document.createElement('div');
    currentSongEl.className = 'tk-player-song-title';
    currentSongEl.textContent = 'No song loaded';

    songTimeEl = document.createElement('div');
    songTimeEl.className = 'tk-player-time';
    songTimeEl.textContent = '0:00 / 0:00';

    songInfo.appendChild(currentSongEl);
    songInfo.appendChild(songTimeEl);

    // Visualizer
    visualizer = document.createElement('div');
    visualizer.className = 'tk-player-visualizer';
    for (let i = 0; i < 10; i++) {
        const bar = document.createElement('div');
        bar.className = 'tk-visualizer-bar';
        visualizer.appendChild(bar);
    }

    display.appendChild(songInfo);
    display.appendChild(visualizer);

    // Seek bar
    seekBar = document.createElement('input');
    seekBar.type = 'range';
    seekBar.id = 'tk-seek-bar';
    seekBar.className = 'tk-player-seek-bar';
    seekBar.value = 0;
    seekBar.min = 0;
    seekBar.max = 100;

    // Control row
    const controlRow = document.createElement('div');
    controlRow.className = 'tk-player-control-row';

    // Main buttons
    const mainButtons = document.createElement('div');
    mainButtons.className = 'tk-player-buttons';

    const prevBtn = createButton('|<', prevTrack);
    const playBtn = createButton('>', () => {
        if (isPlaying) return;
        if (!audio.src) {
            loadSong(currentSongIndex).then(playSong);
        } else {
            playSong();
        }
    });
    const pauseBtn = createButton('||', pauseSong);
    const stopBtn = createButton('[]', stopSong);
    const nextBtn = createButton('>|', nextTrack);

    mainButtons.appendChild(prevBtn);
    mainButtons.appendChild(playBtn);
    mainButtons.appendChild(pauseBtn);
    mainButtons.appendChild(stopBtn);
    mainButtons.appendChild(nextBtn);

    // Extra buttons
    const extraButtons = document.createElement('div');
    extraButtons.className = 'tk-player-buttons';

    const plBtn = createButton('PL', togglePlaylist);
    shuffleBtn = createButton('S', toggleShuffle);
    repeatBtn = createButton('R', toggleRepeat);

    extraButtons.appendChild(plBtn);
    extraButtons.appendChild(shuffleBtn);
    extraButtons.appendChild(repeatBtn);

    controlRow.appendChild(mainButtons);
    controlRow.appendChild(extraButtons);

    playerBody.appendChild(display);
    playerBody.appendChild(seekBar);
    playerBody.appendChild(controlRow);

    // Playlist (appended to body separately to avoid overflow clipping)
    playerPlaylist = document.createElement('div');
    playerPlaylist.className = 'tk-player-playlist';
    playerPlaylist.id = 'tk-player-playlist';
    populatePlaylist();

    // Assemble player
    playerWindow.appendChild(titleBar);
    playerWindow.appendChild(playerBody);

    // Add to document
    document.body.appendChild(playerWindow);
    document.body.appendChild(playerPlaylist);

    // Bring to front on click
    playerWindow.addEventListener('mousedown', bringToFront);

    // Setup dragging
    setupDragging(titleBar);

    // Setup audio events
    setupAudioEvents();

    // Initialize with first song title
    if (playlist.length > 0 && currentSongEl) {
        currentSongEl.textContent = playlist[0].title;
    }

    return playerWindow;
}

function createButton(text, onClick) {
    const btn = document.createElement('div');
    btn.className = 'tk-player-button';
    btn.textContent = text;
    btn.onclick = onClick;
    return btn;
}

// ============================================================================
// DRAGGING
// ============================================================================

function setupDragging(titleBar) {
    titleBar.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function startDrag(e) {
    if (e.target.classList.contains('tk-window-btn')) return;

    isDragging = true;
    dragOffsetX = e.clientX - playerWindow.offsetLeft;
    dragOffsetY = e.clientY - playerWindow.offsetTop;
    document.body.classList.add('tk-no-select');
}

function onMouseMove(e) {
    if (isDragging && playerWindow) {
        const newLeft = e.clientX - dragOffsetX;
        const newTop = Math.max(0, e.clientY - dragOffsetY);
        playerWindow.style.left = `${newLeft}px`;
        playerWindow.style.top = `${newTop}px`;

        // Update playlist position if visible
        if (playerPlaylist && playerPlaylist.style.display === 'block') {
            const rect = playerWindow.getBoundingClientRect();
            playerPlaylist.style.left = rect.left + 'px';
            playerPlaylist.style.top = rect.bottom + 'px';
        }
    }
}

function onMouseUp() {
    if (isDragging) {
        isDragging = false;
        saveState(); // Save position after drag
    }
    document.body.classList.remove('tk-no-select');
}

// ============================================================================
// AUDIO EVENTS
// ============================================================================

function setupAudioEvents() {
    audio.addEventListener('timeupdate', () => {
        if (songTimeEl && !isNaN(audio.duration)) {
            songTimeEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }
        // Update seek bar
        if (seekBar && !seeking && isFinite(audio.duration) && audio.duration > 0) {
            seekBar.value = (audio.currentTime / audio.duration) * 100;
        }
    });

    audio.addEventListener('ended', () => {
        if (isRepeat) {
            audio.currentTime = 0;
            playSong();
        } else {
            nextTrack();
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        if (songTimeEl) {
            songTimeEl.textContent = `0:00 / ${formatTime(audio.duration)}`;
        }
    });

    // Seek bar events
    if (seekBar) {
        seekBar.addEventListener('mousedown', (e) => {
            seeking = true;
            audio.pause();

            const seek = (event) => {
                const rect = seekBar.getBoundingClientRect();
                const clickX = event.clientX - rect.left;
                const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                if (!isNaN(audio.duration)) {
                    audio.currentTime = percentage * audio.duration;
                    seekBar.value = percentage * 100;
                }
            };

            const stopSeeking = () => {
                seeking = false;
                if (isPlaying) {
                    audio.play();
                }
                document.removeEventListener('mousemove', seek);
                document.removeEventListener('mouseup', stopSeeking);
            };

            document.addEventListener('mousemove', seek);
            document.addEventListener('mouseup', stopSeeking);
            seek(e);
        });

        seekBar.addEventListener('input', () => {
            if (!isNaN(audio.duration)) {
                audio.currentTime = (seekBar.value / 100) * audio.duration;
            }
        });
    }
}

// ============================================================================
// VISIBILITY CONTROLS
// ============================================================================

export function showMusicPlayer() {
    if (playerWindow) {
        playerWindow.classList.remove('tk-hidden');
        saveState();
    }
}

export function hideMusicPlayer() {
    if (playerWindow) {
        playerWindow.classList.add('tk-hidden');
        saveState();
    }
    // Also hide playlist when player is hidden
    if (playerPlaylist) {
        playerPlaylist.style.display = 'none';
    }
}

export function toggleMusicPlayer() {
    if (playerWindow) {
        if (playerWindow.classList.contains('tk-hidden')) {
            showMusicPlayer();
        } else {
            hideMusicPlayer();
        }
    }
}

export function isMusicPlayerVisible() {
    return playerWindow && !playerWindow.classList.contains('tk-hidden');
}

// ============================================================================
// Z-INDEX MANAGEMENT
// ============================================================================

let topZIndex = 10000;

function bringToFront() {
    topZIndex++;
    playerWindow.style.zIndex = topZIndex;
}

export function getTopZIndex() {
    return topZIndex;
}

export function setTopZIndex(z) {
    topZIndex = z;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    playerWindow,
    audio,
    playlist,
    playSong,
    pauseSong,
    stopSong,
    nextTrack,
    prevTrack
};
