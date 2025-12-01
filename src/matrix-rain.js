/* ============================================================================
   TERMINAL KIT - Matrix Rain Effect
   A standalone matrix rain background effect
   ============================================================================ */

let canvas = null;
let ctx = null;
let matrixContainer = null;
let animationInterval = null;
let drops = [];
let isEnabled = true;

// Default configuration
const defaultConfig = {
    containerId: 'matrixRain',
    fontSize: 15,
    columnWidth: 20,
    fadeOpacity: 0.05,
    color: '#0f0',
    chars: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF!@#$%^&*',
    speed: 35,
    autoStart: true
};

let config = { ...defaultConfig };

// ============================================================================
// INITIALIZATION
// ============================================================================

function init(options = {}) {
    config = { ...defaultConfig, ...options };

    // Find or create container
    matrixContainer = document.getElementById(config.containerId);

    if (!matrixContainer) {
        // Create the container if it doesn't exist
        matrixContainer = document.createElement('div');
        matrixContainer.id = config.containerId;
        matrixContainer.className = 'matrix-rain';
        matrixContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            overflow: hidden;
            opacity: 0.1;
        `;
        document.body.insertBefore(matrixContainer, document.body.firstChild);
    }

    // Create canvas
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    matrixContainer.appendChild(canvas);

    // Set canvas size
    resizeCanvas();

    // Initialize drops
    initDrops();

    // Start animation if autoStart is true
    if (config.autoStart) {
        start();
    }

    // Handle window resize
    window.addEventListener('resize', handleResize);

    console.log('[TerminalKit] Matrix rain initialized');
}

function initDrops() {
    const columns = Math.floor(canvas.width / config.columnWidth);
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
    }
}

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

function handleResize() {
    resizeCanvas();
    initDrops();
}

// ============================================================================
// ANIMATION
// ============================================================================

function draw() {
    if (!ctx || !canvas) return;

    // Fade effect
    ctx.fillStyle = `rgba(0, 0, 0, ${config.fadeOpacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw characters
    ctx.fillStyle = config.color;
    ctx.font = `${config.fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const char = config.chars[Math.floor(Math.random() * config.chars.length)];
        ctx.fillText(char, i * config.columnWidth, drops[i]);

        // Reset drop when it reaches bottom
        if (drops[i] > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i] += config.columnWidth;
    }
}

function start() {
    if (animationInterval) return; // Already running

    isEnabled = true;
    if (matrixContainer) {
        matrixContainer.style.display = 'block';
    }
    animationInterval = setInterval(draw, config.speed);
    console.log('[TerminalKit] Matrix rain started');
}

function stop() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
    isEnabled = false;
    if (matrixContainer) {
        matrixContainer.style.display = 'none';
    }
    console.log('[TerminalKit] Matrix rain stopped');
}

function toggle() {
    if (isEnabled) {
        stop();
    } else {
        start();
    }
    return isEnabled;
}

function isRunning() {
    return isEnabled;
}

// ============================================================================
// CLEANUP
// ============================================================================

function destroy() {
    stop();
    window.removeEventListener('resize', handleResize);

    if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
    }

    canvas = null;
    ctx = null;
    drops = [];

    console.log('[TerminalKit] Matrix rain destroyed');
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    init as initMatrixRain,
    start as startMatrixRain,
    stop as stopMatrixRain,
    toggle as toggleMatrixRain,
    isRunning as isMatrixRunning,
    destroy as destroyMatrixRain
};
