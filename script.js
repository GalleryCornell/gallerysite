// All artwork images from Featured Works folders - 12 total
const artworkImages = [
    // Paolo Roversi - Along the Way (4 items)
    "ARTWORKS/Paolo Roversi_Along the Way/Featured Works/Emeline, Paris.png",
    "ARTWORKS/Paolo Roversi_Along the Way/Featured Works/Audrey for Dior, Studio Luce, Paris.webp",
    "ARTWORKS/Paolo Roversi_Along the Way/Featured Works/Kate, New York.webp",
    "ARTWORKS/Paolo Roversi_Along the Way/Featured Works/Sara Grace, Paris.webp",

    // Robert Longo - The Weight of Hope (4 items)
    "ARTWORKS/Robert Longo_The Weight of Hope/Featured Works/Icarus Rising.webp",
    "ARTWORKS/Robert Longo_The Weight of Hope/Featured Works/Study of Brooklyn Forest.webp",
    "ARTWORKS/Robert Longo_The Weight of Hope/Featured Works/Study of Roaring Tiger.webp",
    "ARTWORKS/Robert Longo_The Weight of Hope/Featured Works/Untitled (Iceberg for Greta Thunberg).webp",

    // Trevor Paglen - Cardinals (4 items)
    "ARTWORKS/Trevor Paglen_Cardinals/Featured Works/Near Summerfield Lane (undated).png",
    "ARTWORKS/Trevor Paglen_Cardinals/Featured Works/Near Black Point (undated).webp",
    "ARTWORKS/Trevor Paglen_Cardinals/Featured Works/Near Golden Valley (undated).webp",
    "ARTWORKS/Trevor Paglen_Cardinals/Featured Works/Near Highway 80 (undated).webp"
];

// Map images to their exhibition data
function getArtworkData(imagePath) {
    if (imagePath.includes("Paolo Roversi")) {
        return {
            artist: "Paolo Roversi",
            title: "Along the Way",
            textFile: "ARTWORKS/Paolo Roversi_Along the Way/Exhibition_Text.txt"
        };
    } else if (imagePath.includes("Robert Longo")) {
        return {
            artist: "Robert Longo",
            title: "The Weight of Hope",
            textFile: "ARTWORKS/Robert Longo_The Weight of Hope/Exhibition_text.txt"
        };
    } else if (imagePath.includes("Trevor Paglen")) {
        return {
            artist: "Trevor Paglen",
            title: "Cardinals",
            textFile: "ARTWORKS/Trevor Paglen_Cardinals/Exhibition_Text.txt"
        };
    }
}

// Create artworks array
const artworks = artworkImages.map(img => ({
    image: img,
    ...getArtworkData(img)
}));

// Matter.js module aliases
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Events = Matter.Events;

// Game state
const game = {
    clawX: 50, // Percentage position
    isDropping: false,
    isReturning: false,
    grabbedBody: null,
    grabbedElement: null,
    moveSpeed: 0.8,
    successRate: 0.30, // 30% success rate
    engine: null,
    items: [],
    walls: [],
    // Game area dimensions (will be set based on actual machine image)
    playArea: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    // Debug settings
    debug: {
        widthPercent: 55,
        heightPercent: 50,
        leftPercent: 22.5,
        topPercent: 30,
        showOutline: false
    }
};

// DOM elements
const clawAssembly = document.getElementById('claw-assembly');
const clawArm = document.getElementById('claw-arm');
const claw = document.getElementById('claw');
const gameArea = document.getElementById('game-area');
const itemsContainer = document.getElementById('items-container');
const gameStatus = document.getElementById('game-status');
const modal = document.getElementById('artwork-modal');
const closeButton = document.querySelector('.close-button');
const physicsCanvas = document.getElementById('physics-canvas');

// Initialize game
function init() {
    // Wait for images to load to get correct dimensions
    const backImage = document.getElementById('back-layer');

    if (backImage.complete) {
        setupGame();
    } else {
        backImage.onload = setupGame;
    }
}

function setupGame() {
    calculatePlayArea();
    setupPhysics();
    setupArtworkItems();
    setupControls();
    updateClawPosition();
    loadExhibitionTexts();

    // Start physics update loop
    requestAnimationFrame(updatePhysics);
}

// Calculate the play area based on machine dimensions
function calculatePlayArea() {
    const backImage = document.getElementById('back-layer');
    const rect = backImage.getBoundingClientRect();

    // Machine is centered, so calculate from its actual position
    const machineLeft = rect.left;
    const machineTop = rect.top;
    const machineWidth = rect.width;
    const machineHeight = rect.height;

    // Use fixed width (737px) and center it horizontally
    game.playArea.width = 737;
    game.playArea.height = machineHeight * (game.debug.heightPercent / 100);

    // Center the play area horizontally relative to the machine
    const machineCenterX = machineLeft + machineWidth / 2;
    game.playArea.left = machineCenterX - game.playArea.width / 2;

    game.playArea.top = machineTop + machineHeight * (game.debug.topPercent / 100);
    game.playArea.right = game.playArea.left + game.playArea.width;
    game.playArea.bottom = game.playArea.top + game.playArea.height;

    // Set canvas and containers size
    gameArea.style.width = game.playArea.width + 'px';
    gameArea.style.height = game.playArea.height + 'px';
    gameArea.style.left = game.playArea.left + 'px';
    gameArea.style.top = game.playArea.top + 'px';
    gameArea.style.transform = 'none';

    // Update debug info
    updateDebugInfo();

    // Update outline if visible
    if (game.debug.showOutline) {
        updatePlayAreaOutline();
    }
}

// Setup Matter.js physics
function setupPhysics() {
    game.engine = Engine.create({
        gravity: { x: 0, y: 0.5 } // Moderate gravity
    });

    // Create invisible walls - floor raised to prevent items falling through
    const wallThickness = 50;
    const walls = [
        // Bottom - positioned higher up to keep items fully visible
        Bodies.rectangle(
            game.playArea.width / 2,
            game.playArea.height - 60, // Raised by 60px from bottom
            game.playArea.width,
            wallThickness,
            { isStatic: true, label: 'bottom', friction: 0.8 }
        ),
        // Left
        Bodies.rectangle(
            -wallThickness / 2,
            game.playArea.height / 2,
            wallThickness,
            game.playArea.height,
            { isStatic: true, label: 'left' }
        ),
        // Right
        Bodies.rectangle(
            game.playArea.width + wallThickness / 2,
            game.playArea.height / 2,
            wallThickness,
            game.playArea.height,
            { isStatic: true, label: 'right' }
        )
    ];

    World.add(game.engine.world, walls);
    game.walls = walls;
}

// Setup artwork items with physics
function setupArtworkItems() {
    const itemWidth = 80; // Larger to account for full image size
    const itemHeight = 80;

    artworks.forEach((artwork, index) => {
        // Create DOM element
        const item = document.createElement('img');
        item.src = artwork.image;
        item.className = 'artwork-item';
        item.dataset.index = index;

        // Random position in bottom area, accounting for item size
        const margin = itemWidth / 2;
        const x = Math.random() * (game.playArea.width - itemWidth - margin * 2) + margin + itemWidth / 2;
        const y = game.playArea.height * 0.4 + Math.random() * (game.playArea.height * 0.2);

        // Random 3D skew effect
        const rotateX = (Math.random() - 0.5) * 30; // -15 to 15 degrees
        const rotateY = (Math.random() - 0.5) * 30;
        const rotateZ = (Math.random() - 0.5) * 60; // -30 to 30 degrees

        item.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;

        // Create physics body - slightly larger to prevent edges from going through floor
        const body = Bodies.rectangle(x, y, itemWidth, itemHeight, {
            restitution: 0.2,
            friction: 0.6,
            density: 0.002,
            label: 'artwork-' + index
        });

        // Store references
        game.items.push({
            element: item,
            body: body,
            artwork: artwork,
            grabbed: false,
            transform: { rotateX, rotateY, rotateZ },
            itemWidth: itemWidth,
            itemHeight: itemHeight
        });

        World.add(game.engine.world, body);
        itemsContainer.appendChild(item);
    });
}

// Update physics and render
function updatePhysics() {
    Engine.update(game.engine, 1000 / 60);

    // Update DOM elements to match physics bodies
    game.items.forEach(item => {
        if (!item.grabbed && item.body) {
            const pos = item.body.position;
            const angle = item.body.angle;

            // Center the image on the physics body
            const halfWidth = item.itemWidth / 2;
            const halfHeight = item.itemHeight / 2;

            item.element.style.left = (pos.x - halfWidth) + 'px';
            item.element.style.top = (pos.y - halfHeight) + 'px';
            item.element.style.transform =
                `rotateX(${item.transform.rotateX}deg) rotateY(${item.transform.rotateY}deg) rotateZ(${item.transform.rotateZ + angle * (180/Math.PI)}deg)`;
        }
    });

    requestAnimationFrame(updatePhysics);
}

// Setup keyboard controls
function setupControls() {
    document.addEventListener('keydown', (e) => {
        // Debug toggle
        if (e.key === 'd' || e.key === 'D') {
            toggleDebugMenu();
            return;
        }

        if (game.isDropping || game.isReturning) return;

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                game.clawX = Math.max(10, game.clawX - game.moveSpeed);
                updateClawPosition();
                break;
            case 'ArrowRight':
                e.preventDefault();
                game.clawX = Math.min(90, game.clawX + game.moveSpeed);
                updateClawPosition();
                break;
            case ' ':
                e.preventDefault();
                dropClaw();
                break;
        }
    });

    // Modal close
    closeButton.onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };

    // Setup debug controls
    setupDebugControls();
}

// Update claw horizontal position
function updateClawPosition() {
    const xPos = game.playArea.left + (game.playArea.width * (game.clawX / 100));
    clawAssembly.style.left = xPos + 'px';
    clawAssembly.style.transform = 'translateX(-50%)';
}

// Drop claw mechanism
function dropClaw() {
    if (game.isDropping || game.isReturning) return;

    game.isDropping = true;
    gameStatus.textContent = 'Dropping...';

    const maxDrop = game.playArea.height * 0.7; // Drop 70% down
    let currentDrop = 0;
    const dropSpeed = 4;

    const dropInterval = setInterval(() => {
        currentDrop += dropSpeed;
        clawArm.style.transform = `translateY(${currentDrop}px)`;

        if (currentDrop >= maxDrop) {
            clearInterval(dropInterval);
            attemptGrab(currentDrop);
        }
    }, 16);
}

// Attempt to grab an item
function attemptGrab(dropDistance) {
    const clawRect = claw.getBoundingClientRect();
    // Claw center point (grab point is at center of claw image)
    const clawCenterX = clawRect.left + clawRect.width / 2;
    const clawCenterY = clawRect.top + clawRect.height / 2;

    let closestItem = null;
    let minDistance = Infinity;

    // Find closest item to claw center
    game.items.forEach(item => {
        if (item.grabbed) return;

        const itemRect = item.element.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2;
        const itemCenterY = itemRect.top + itemRect.height / 2;

        const distance = Math.sqrt(
            Math.pow(clawCenterX - itemCenterX, 2) +
            Math.pow(clawCenterY - itemCenterY, 2)
        );

        if (distance < minDistance && distance < 80) {
            minDistance = distance;
            closestItem = item;
        }
    });

    // Lift item momentarily regardless of success
    if (closestItem) {
        liftItem(closestItem, dropDistance);
    } else {
        returnClaw(dropDistance, null);
    }
}

// Lift item with claw - synchronized with claw movement
function liftItem(item, dropDistance) {
    // Remove from physics temporarily
    World.remove(game.engine.world, item.body);

    const willSucceed = Math.random() < game.successRate;

    // Store the item's initial position
    const startX = parseFloat(item.element.style.left);
    const startY = parseFloat(item.element.style.top);

    const halfWidth = item.itemWidth / 2;
    const halfHeight = item.itemHeight / 2;

    if (willSucceed) {
        game.grabbedBody = item.body;
        game.grabbedElement = item;
        item.grabbed = true;
        item.startGrabX = startX;
        item.startGrabY = startY;
        gameStatus.textContent = 'Got one!';

        // Attach item to claw - it will move with claw in returnClaw
        returnClaw(dropDistance, item);
    } else {
        gameStatus.textContent = 'Lifting...';

        // Failed grab - lift with claw for a short distance, then drop
        const partialLift = 100; // Lift 100px before dropping
        let clawReturnAmount = 0;
        const clawReturnSpeed = 5;
        let itemDropped = false;

        // Mark item as temporarily grabbed to prevent physics from updating its position
        item.grabbed = true;

        // Calculate how far the claw needs to travel before it reaches the item
        const distanceBeforeGrab = Math.max(0, dropDistance - startY);

        const liftInterval = setInterval(() => {
            clawReturnAmount += clawReturnSpeed;

            // Move claw up
            clawArm.style.transform = `translateY(${dropDistance - clawReturnAmount}px)`;

            // Item only starts moving once claw has reached it
            if (clawReturnAmount >= distanceBeforeGrab) {
                const itemMovement = clawReturnAmount - distanceBeforeGrab;

                // Item follows claw vertically only while being lifted (max 100px)
                if (itemMovement <= partialLift) {
                    // Update item position smoothly as it lifts with claw
                    const currentItemY = startY - itemMovement;
                    item.element.style.left = startX + 'px';
                    item.element.style.top = currentItemY + 'px';
                } else if (!itemDropped) {
                    // Drop the item back to physics at lifted position
                    itemDropped = true;
                    item.grabbed = false; // Allow physics to take over
                    gameStatus.textContent = 'Dropped it...';

                    const dropPos = {
                        x: startX + halfWidth,
                        y: (startY - partialLift) + halfHeight
                    };
                    Body.setPosition(item.body, dropPos);
                    World.add(game.engine.world, item.body);
                }
            }

            // Check if claw has fully returned
            if (clawReturnAmount >= dropDistance) {
                clearInterval(liftInterval);
                clawArm.style.transform = 'translateY(0)';

                game.isDropping = false;
                game.isReturning = false;

                const remainingItems = game.items.filter(i => !i.grabbed).length;
                gameStatus.textContent = remainingItems === 0 ?
                    'All artworks collected! Refresh to play again.' :
                    `Ready to Play! (${remainingItems} items left)`;
            }
        }, 16);
    }
}

// Return claw to top with grabbed item
function returnClaw(dropDistance, grabbedItem) {
    game.isReturning = true;

    let clawReturnAmount = 0;
    const returnSpeed = 5;

    // Store starting position for grabbed item
    const startX = grabbedItem.startGrabX;
    const startY = grabbedItem.startGrabY;

    // Calculate how far the claw needs to travel before it reaches the item
    // The claw is currently at dropDistance, item is at startY in play area coordinates
    // The claw starts at dropDistance pixels down from the top of play area
    // It needs to return to startY before the item starts moving
    const distanceBeforeGrab = Math.max(0, dropDistance - startY);

    const returnInterval = setInterval(() => {
        clawReturnAmount += returnSpeed;

        // Move claw up
        const clawYPos = dropDistance - clawReturnAmount;
        clawArm.style.transform = `translateY(${clawYPos}px)`;

        // Item only moves once claw has traveled far enough to reach it
        if (clawReturnAmount >= distanceBeforeGrab) {
            // Claw has reached the item, now they move together
            const itemMovement = clawReturnAmount - distanceBeforeGrab;
            const newItemY = startY - itemMovement;
            grabbedItem.element.style.left = startX + 'px';
            grabbedItem.element.style.top = newItemY + 'px';
        }

        // Check if claw has fully returned
        if (clawReturnAmount >= dropDistance) {
            clearInterval(returnInterval);
            clawArm.style.transform = 'translateY(0)';

            // Show artwork info and remove item
            showArtworkInfo(grabbedItem.artwork);
            removeItem(grabbedItem);
            game.grabbedBody = null;
            game.grabbedElement = null;

            game.isDropping = false;
            game.isReturning = false;

            const remainingItems = game.items.filter(i => !i.grabbed).length;
            gameStatus.textContent = remainingItems === 0 ?
                'All artworks collected! Refresh to play again.' :
                `Ready to Play! (${remainingItems} items left)`;
        }
    }, 16);
}

// Remove grabbed item
function removeItem(item) {
    setTimeout(() => {
        item.element.style.transition = 'opacity 0.5s';
        item.element.style.opacity = '0';
        setTimeout(() => {
            item.element.remove();
        }, 500);
    }, 500);
}

// Exhibition texts cache
const exhibitionTexts = {};

// Load exhibition texts
async function loadExhibitionTexts() {
    const uniqueTextFiles = [...new Set(artworks.map(a => a.textFile))];

    for (const textFile of uniqueTextFiles) {
        try {
            const response = await fetch(textFile);
            const text = await response.text();
            exhibitionTexts[textFile] = parseExhibitionText(text);
        } catch (error) {
            console.error('Error loading exhibition text:', error);
        }
    }
}

// Parse exhibition text file
function parseExhibitionText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);

    return {
        artist: lines[0] || '',
        title: lines[1] || '',
        status: lines[2] || '',
        dates: lines[3] || '',
        location: lines[4] || '',
        description: lines.slice(5).join('\n\n')
    };
}

// Show artwork information modal
function showArtworkInfo(artwork) {
    const exhibitionInfo = exhibitionTexts[artwork.textFile];

    document.getElementById('modal-artwork-image').src = artwork.image;
    document.getElementById('modal-artist-name').textContent = exhibitionInfo.artist;
    document.getElementById('modal-exhibition-title').textContent = exhibitionInfo.title;
    document.getElementById('modal-exhibition-details').textContent =
        `${exhibitionInfo.status} | ${exhibitionInfo.dates} | ${exhibitionInfo.location}`;

    const paragraphs = exhibitionInfo.description.split('\n\n')
        .map(p => `<p>${p}</p>`)
        .join('');
    document.getElementById('modal-exhibition-text').innerHTML = paragraphs;

    modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    modal.classList.add('hidden');
}

// ===== DEBUG CONTROLS =====

function setupDebugControls() {
    const widthSlider = document.getElementById('width-slider');
    const heightSlider = document.getElementById('height-slider');
    const leftSlider = document.getElementById('left-slider');
    const topSlider = document.getElementById('top-slider');
    const showBoundsBtn = document.getElementById('show-bounds');

    widthSlider.addEventListener('input', (e) => {
        game.debug.widthPercent = parseFloat(e.target.value);
        document.getElementById('width-value').textContent = e.target.value;
        recalculatePlayArea();
    });

    heightSlider.addEventListener('input', (e) => {
        game.debug.heightPercent = parseFloat(e.target.value);
        document.getElementById('height-value').textContent = e.target.value;
        recalculatePlayArea();
    });

    leftSlider.addEventListener('input', (e) => {
        game.debug.leftPercent = parseFloat(e.target.value);
        document.getElementById('left-value').textContent = e.target.value;
        recalculatePlayArea();
    });

    topSlider.addEventListener('input', (e) => {
        game.debug.topPercent = parseFloat(e.target.value);
        document.getElementById('top-value').textContent = e.target.value;
        recalculatePlayArea();
    });

    showBoundsBtn.addEventListener('click', () => {
        game.debug.showOutline = !game.debug.showOutline;
        if (game.debug.showOutline) {
            createPlayAreaOutline();
        } else {
            removePlayAreaOutline();
        }
    });
}

function toggleDebugMenu() {
    const debugMenu = document.getElementById('debug-menu');
    debugMenu.classList.toggle('visible');
}

function recalculatePlayArea() {
    // Clear existing physics
    if (game.engine) {
        World.clear(game.engine.world, false);
        game.items = [];
        itemsContainer.innerHTML = '';
    }

    // Recalculate
    calculatePlayArea();
    setupPhysics();
    setupArtworkItems();
}

function updateDebugInfo() {
    const debugInfo = document.getElementById('debug-info');
    const backImage = document.getElementById('back-layer');
    const rect = backImage.getBoundingClientRect();

    debugInfo.innerHTML = `
        Machine Position: (${Math.round(rect.left)}, ${Math.round(rect.top)})<br>
        Machine Size: ${Math.round(rect.width)} x ${Math.round(rect.height)}px<br>
        <br>
        Play Area Position: (${Math.round(game.playArea.left)}, ${Math.round(game.playArea.top)})<br>
        Play Area Size: ${Math.round(game.playArea.width)} x ${Math.round(game.playArea.height)}px
    `;
}

function createPlayAreaOutline() {
    removePlayAreaOutline(); // Remove existing if any

    const outline = document.createElement('div');
    outline.className = 'play-area-outline';
    outline.id = 'play-area-outline';
    outline.style.left = game.playArea.left + 'px';
    outline.style.top = game.playArea.top + 'px';
    outline.style.width = game.playArea.width + 'px';
    outline.style.height = game.playArea.height + 'px';
    document.body.appendChild(outline);
}

function updatePlayAreaOutline() {
    const outline = document.getElementById('play-area-outline');
    if (outline) {
        outline.style.left = game.playArea.left + 'px';
        outline.style.top = game.playArea.top + 'px';
        outline.style.width = game.playArea.width + 'px';
        outline.style.height = game.playArea.height + 'px';
    }
}

function removePlayAreaOutline() {
    const outline = document.getElementById('play-area-outline');
    if (outline) {
        outline.remove();
    }
}

// Start the game
init();
