import { createWindow, openWindows, setActiveWindow } from './main.js';

let audio = new Audio(); // Moved to module level

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

let audioCtx;
let analyser;
let source;
let bufferLength;
let dataArray;

// Module-level DOM element references
let visualizer;
let playerPlaylist;
let prevBtn;
let playBtn;
let pauseBtn;
let stopBtn;
let nextBtn;
let currentSongEl;
let songTimeEl;
let seekBar;
let shuffleBtn;
let repeatBtn;
let musicPlayerWindow; // Reference to the created window

let visualizerInterval;
let seeking = false; // For seek bar

const playlist = [
    { title: "edIT - Twenty Minutes", src: "./music/01 - edIT - Twenty Minutes.mp3" },
    { title: "The Alg0rithm - Access Granted", src: "./music/02 - The Alg0rithm - Access Granted.mp3" },
    { title: "Master Boot Record - MSDOS.SYS", src: "./music/03 - Master Boot Record - MSDOS.SYS.mp3" },
    { title: "Igorrr - Tendon", src: "./music/04- Igorrr - Tendon.mp3" },
    { title: "edIT - Dex", src: "./music/05 - edIT - Dex.mp3" },
    { title: "The Alg0rithm - Trojans", src: "./music/06 - The Alg0rithm - Trojans.mp3" },
    { title: "Master Boot Record - CONFIG.SYS", src: "./music/07 - Master Boot Record - CONFIG.SYS.mp3" },
    { title: "Igorrr - Excessive Funeral", src: "./music/08 - Igorrr - Excessive Funeral.mp3" },
];

function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60) || 0;
    const s = Math.floor(secs - m * 60) || 0;
    return `${m}:${String(s).padStart(2, '0')}`;
};

function startVisualizer() {
    stopVisualizer();
    visualizerInterval = setInterval(() => {
        const bars = visualizer.getElementsByClassName('visualizer-bar');
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
        const bars = visualizer.getElementsByClassName('visualizer-bar');
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.height = '0%';
        }
    }
}

function loadSong(index) {
    const song = playlist[index];
    audio.src = song.src;
    currentSongEl.textContent = song.title;
    populatePlaylist(); // Renamed from renderPlaylist

    // Return a promise that resolves when audio is ready to play
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

        // If already loaded, resolve immediately
        if (audio.readyState >= 3) { // HAVE_FUTURE_DATA or better
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
        playBtn.style.background = 'linear-gradient(to bottom, #777 0%, #555 100%)';
        pauseBtn.style.background = 'linear-gradient(to bottom, #555 0%, #333 100%)';
        startVisualizer();
    }).catch(error => {
        console.error("Error playing audio:", error);
        currentSongEl.textContent = "Error playing file";
        isPlaying = false;
    });
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playBtn.style.background = 'linear-gradient(to bottom, #555 0%, #333 100%)';
    pauseBtn.style.background = 'linear-gradient(to bottom, #777 0%, #555 100%)';
    stopVisualizer();
}

function stopAudio() { // Renamed from stopSong
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    playBtn.style.background = 'linear-gradient(to bottom, #555 0%, #333 100%)';
    pauseBtn.style.background = 'linear-gradient(to bottom, #555 0%, #333 100%)';
    if (!isNaN(audio.duration)) {
        songTimeEl.textContent = `0:00 / ${formatTime(audio.duration)}`;
    } else {
        songTimeEl.textContent = "0:00 / 0:00";
    }
    seekBar.value = 0;
    stopVisualizer();
}

async function nextTrack() {
    if (isShuffle) {
        if (playlist.length > 1) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (newIndex === currentSongIndex);
            currentSongIndex = newIndex;
        }
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
    }
    try {
        await loadSong(currentSongIndex);
        playSong();
    } catch (error) {
        console.error("Error loading next track:", error);
        currentSongEl.textContent = "Error loading track";
    }
}

async function prevTrack() {
    if (isShuffle) {
        if (playlist.length > 1) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (newIndex === currentSongIndex);
            currentSongIndex = newIndex;
        }
    } else {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    }
    try {
        await loadSong(currentSongIndex);
        playSong();
    } catch (error) {
        console.error("Error loading previous track:", error);
        currentSongEl.textContent = "Error loading track";
    }
}

function updateSongDisplay() {
    currentSongEl.textContent = playlist[currentSongIndex].title;
    populatePlaylist();
}

function populatePlaylist() { // Adapted from renderPlaylist
    playerPlaylist.innerHTML = '';
    playlist.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        if (index === currentSongIndex) {
            item.classList.add('active');
        }
        item.textContent = `[${(index + 1).toString().padStart(2, '0')}] ${song.title}`;
        item.addEventListener('click', async function() {
            currentSongIndex = index;
            try {
                await loadSong(currentSongIndex);
                playSong();
            } catch (error) {
                console.error("Error loading song from playlist:", error);
                currentSongEl.textContent = "Error loading track";
            }
        });
        playerPlaylist.appendChild(item);
    });
}

function createMusicPlayerWindow() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        analyser.fftSize = 32; // Smaller FFT size for fewer bars
        bufferLength = analyser.frequencyBinCount; // Half of fftSize
        dataArray = new Uint8Array(bufferLength);
    }
    const musicPlayerContent = `
        <div class="music-player" id="musicPlayer">
            <div class="player-header draggable-title-bar" id="playerHeader">
                <div class="player-title">Music Player v2.0</div>
                <div class="player-controls">
                    <div class="player-btn minimize" id="playerMinimizeBtn"></div>
                    <div class="player-btn playlist-toggle" id="playerTogglePlaylistBtn"></div>
                    <div class="player-btn close" id="playerCloseBtn"></div>
                </div>
            </div>
            <div class="player-body">
                <div class="player-display">
                    <div class="player-song-info">
                        <div class="player-song-title" id="currentSong">No song loaded</div>
                        <div class="player-time" id="songTime">0:00 / 0:00</div>
                    </div>
                    <div class="player-visualizer" id="visualizer">
                        <div class="visualizer-bar"></div>
                        <div class="visualizer-bar"></div>
                        <div class="visualizer-bar"></div>
                        <div class="visualizer-bar"></div>
                        <div class="visualizer-bar"></div>
                        <div class="visualizer-bar"></div>
                        <div class="visualizer-bar"></div>
                        <div class="visualizer-bar"></div>
                        <div class="visualizer-bar"></div>
                        <div class="visualizer-bar"></div>
                    </div>
                </div>
                <input type="range" id="seek-bar" value="0" style="width: 100%; margin-top: 5px;margin-bottom:5px">
                <div class="player-control-row">
                    <div class="player-buttons">
                        <div class="player-button" id="prevBtn">|&lt;</div>
                        <div class="player-button" id="playBtn">&gt;</div>
                        <div class="player-button" id="pauseBtn">||</div>
                        <div class="player-button" id="stopBtn">[]</div>
                        <div class="player-button" id="nextBtn">&gt;|</div>
                    </div>
                    <div class="player-buttons">
                        <div class="player-button" id="playerControlPlaylistBtn">PL</div>
                        <div class="player-button" id="shuffleBtn">S</div>
                        <div class="player-button" id="repeatBtn">R</div>
                    </div>
                </div>
            </div>
            <div class="player-playlist" id="playerPlaylist"></div>
        </div>
    `;

    const options = {
        width: 275,
        height: 123,
        x: 150,
        y: 150,
        resizable: false,
        maximizable: false,
        customFrame: true,
        customClass: 'music-player-window'
    };

    musicPlayerWindow = createWindow('music-player', 'Music Player', musicPlayerContent, options);

    // Ensure window stays visible after creation
    setTimeout(() => {
        if (musicPlayerWindow.style.display !== 'block') {
            musicPlayerWindow.style.display = 'block';
        }
    }, 0);

    const playerHeader = musicPlayerWindow.querySelector('#playerHeader');
    const playerMinimizeBtn = musicPlayerWindow.querySelector('#playerMinimizeBtn');
    const playerCloseBtn = musicPlayerWindow.querySelector('#playerCloseBtn');
    const playerTogglePlaylistBtn = musicPlayerWindow.querySelector('#playerTogglePlaylistBtn');
    
    // Assign module-level DOM elements
    playerPlaylist = musicPlayerWindow.querySelector('#playerPlaylist');
    prevBtn = musicPlayerWindow.querySelector('#prevBtn');
    playBtn = musicPlayerWindow.querySelector('#playBtn');
    pauseBtn = musicPlayerWindow.querySelector('#pauseBtn');
    stopBtn = musicPlayerWindow.querySelector('#stopBtn');
    nextBtn = musicPlayerWindow.querySelector('#nextBtn');
    shuffleBtn = musicPlayerWindow.querySelector('#shuffleBtn');
    repeatBtn = musicPlayerWindow.querySelector('#repeatBtn');
    currentSongEl = musicPlayerWindow.querySelector('#currentSong');
    songTimeEl = musicPlayerWindow.querySelector('#songTime');
    visualizer = musicPlayerWindow.querySelector('#visualizer');
    seekBar = musicPlayerWindow.querySelector('#seek-bar');

    // Event Listeners
    playBtn.addEventListener('click', function() {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        playSong();
    });

    pauseBtn.addEventListener('click', function() {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        pauseSong();
    });

    stopBtn.addEventListener('click', function() {
        stopAudio();
    });

    nextBtn.addEventListener('click', function() {
        nextTrack();
    });

    prevBtn.addEventListener('click', function() {
        prevTrack();
    });

    shuffleBtn.addEventListener('click', function() {
        isShuffle = !isShuffle;
        this.style.background = isShuffle ?
            'linear-gradient(to bottom, #777 0%, #555 100%)' :
            'linear-gradient(to bottom, #555 0%, #333 100%)';
    });

    repeatBtn.addEventListener('click', function() {
        isRepeat = !isRepeat;
        this.style.background = isRepeat ?
            'linear-gradient(to bottom, #777 0%, #555 100%)' :
            'linear-gradient(to bottom, #555 0%, #333 100%)';
    });

    playerTogglePlaylistBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const musicPlayerEl = musicPlayerWindow.querySelector('#musicPlayer');
        const playlistFixedheight = 100; // Fixed height of the playlist

        if (playerPlaylist.style.display === 'block') {
            playerPlaylist.style.display = 'none';
            musicPlayerWindow.style.height = `${musicPlayerEl.offsetHeight}px`; // Revert to original player height
        } else {
            playerPlaylist.style.display = 'block';
            musicPlayerWindow.style.height = `${musicPlayerEl.offsetHeight + playlistFixedheight}px`;
        }
    });

    const playerControlPlaylistBtn = musicPlayerWindow.querySelector('#playerControlPlaylistBtn');
    playerControlPlaylistBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const musicPlayerEl = musicPlayerWindow.querySelector('#musicPlayer');
        const playlistFixedheight = 100; // Fixed height of the playlist

        if (playerPlaylist.style.display === 'block') {
            playerPlaylist.style.display = 'none';
            musicPlayerWindow.style.height = `${musicPlayerEl.offsetHeight}px`; // Revert to original player height
        } else {
            playerPlaylist.style.display = 'block';
            musicPlayerWindow.style.height = `${musicPlayerEl.offsetHeight + playlistFixedheight}px`;
        }
    });

    audio.addEventListener('loadedmetadata', function() {
        songTimeEl.textContent =
            `0:00 / ${formatTime(audio.duration)}`;
    });

    audio.addEventListener('timeupdate', function() {
        if (isPlaying) {
            songTimeEl.textContent =
                `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
            if (isFinite(audio.duration) && audio.duration > 0) { // Check for finite duration
                seekBar.value = (audio.currentTime / audio.duration) * 100;
            }
            if (audio.currentTime >= audio.duration - 0.5) {
                if (isRepeat) {
                    audio.currentTime = 0;
                    audio.play();
                } else {
                    nextTrack();
                }
            }
        }
    });

    seekBar.addEventListener('mousedown', (e) => {
        seeking = true;
        audio.pause(); // Pause audio while seeking

        const seek = (event) => {
            const rect = seekBar.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const percentage = clickX / rect.width;
            if (!isNaN(audio.duration)) {
                audio.currentTime = percentage * audio.duration;
                seekBar.value = percentage * 100; // Update seek bar visually
            }
        };

        const stopSeeking = () => {
            seeking = false;
            audio.play(); // Resume audio after seeking
            document.removeEventListener('mousemove', seek);
            document.removeEventListener('mouseup', stopSeeking);
        };

        document.addEventListener('mousemove', seek);
        document.addEventListener('mouseup', stopSeeking);
        seek(e); // Apply seek immediately on mousedown
    });

    playerCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopAudio();
        musicPlayerWindow.remove();
        const taskbarButton = document.getElementById(`taskbar-button-music-player`);
        if (taskbarButton) {
            taskbarButton.remove();
        }
        delete openWindows['music-player'];
    });

    playerMinimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        musicPlayerWindow.style.display = 'none';
    });

    loadSong(currentSongIndex); // Initial load
}

function initMusicPlayer() {
    const musicPlayerLaunchButton = document.getElementById('music-player-button');

    if (!musicPlayerLaunchButton) {
        console.warn('Music player button not found in DOM');
        return;
    }

    musicPlayerLaunchButton.addEventListener('click', () => {
        const musicPlayerId = 'music-player';
        const musicPlayerWindowElement = document.getElementById(`window-${musicPlayerId}`);

        if (musicPlayerWindowElement) {
            // Window already exists - toggle visibility
            const isHidden = musicPlayerWindowElement.style.display === 'none';

            if (isHidden) {
                // If minimized, restore it
                musicPlayerWindowElement.style.display = 'block';
                setActiveWindow(musicPlayerId);
            } else {
                // If visible, minimize it
                musicPlayerWindowElement.style.display = 'none';
                if (openWindows.active === musicPlayerId) {
                    openWindows.active = null;
                    // Remove active class from taskbar button (if it exists)
                    const taskbarButton = document.getElementById(`taskbar-button-${musicPlayerId}`);
                    if (taskbarButton) {
                        taskbarButton.classList.remove('active');
                    }
                }
            }
        } else {
            // Window does not exist, create it (will be visible by default)
            createMusicPlayerWindow();
        }
    });
}

export { initMusicPlayer };