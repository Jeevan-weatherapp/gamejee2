const basket = document.getElementById("basket");
const fallingObject = document.getElementById("falling-object");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

let score = 0;
let basketPosition = 50; // Now in percentage for better mobile support
let objectPositionY = 0;
let objectPositionX = Math.random() * 90; // Use % for mobile
let fallingSpeed = 3;
let gameRunning = true;
let isBlackBall = false;
let touchStartX = 0;

// Increase apple speed every 15 seconds
setInterval(() => {
    if (gameRunning) {
        fallingSpeed += 1;
    }
}, 15000);

// Move basket with keyboard (for desktop)
document.addEventListener("keydown", (event) => {
    if (gameRunning) {
        if (event.key === "ArrowLeft" && basketPosition > 5) {
            basketPosition -= 5;
        } else if (event.key === "ArrowRight" && basketPosition < 85) {
            basketPosition += 5;
        }
        basket.style.left = basketPosition + "%";
    }
});

// Move basket with swipe (for mobile)
document.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
});

document.addEventListener("touchmove", (event) => {
    if (!gameRunning) return;
    
    let touchEndX = event.touches[0].clientX;
    let difference = touchEndX - touchStartX;

    if (difference > 20 && basketPosition < 85) { 
        basketPosition += 5; // Swipe right
    } else if (difference < -20 && basketPosition > 5) { 
        basketPosition -= 5; // Swipe left
    }

    basket.style.left = basketPosition + "%";
    touchStartX = touchEndX;
});

function dropObject() {
    if (!gameRunning) return;

    objectPositionY += fallingSpeed;
    fallingObject.style.top = objectPositionY + "px";
    fallingObject.style.left = objectPositionX + "%";

    // Check if object reaches the basket
    if (objectPositionY >= 460 && objectPositionX > basketPosition - 10 && objectPositionX < basketPosition + 10) {
        if (isBlackBall) {
            gameOver("Game Over! You caught a BLACK BALL ⚫!");
            return;
        } else {
            score++;
            scoreDisplay.textContent = score;
            resetObject();
        }
    }

    // Apple (🍎) falls to the bottom → Game Over
    if (objectPositionY > 500 && !isBlackBall) {
        gameOver("Game Over! You missed the apple.");
        return;
    }

    // Black ball (⚫) falls to the bottom → Continue game
    if (objectPositionY > 500 && isBlackBall) {
        resetObject(); // Black ball is ignored
    }

    requestAnimationFrame(dropObject);
}

function resetObject() {
    objectPositionY = 0;
    objectPositionX = Math.random() * 90; // Use % for mobile support
    
    // 20% chance of being a black ball
    isBlackBall = Math.random() < 0.2;
    fallingObject.style.backgroundColor = isBlackBall ? "black" : "red";
}

// End game and show restart button
function gameOver(message) {
    gameRunning = false;
    alert(message + " Your score: " + score);
    restartBtn.style.display = "block";
}

// Restart the game
function restartGame() {
    score = 0;
    scoreDisplay.textContent = score;
    basketPosition = 50;
    basket.style.left = basketPosition + "%";
    objectPositionY = 0;
    objectPositionX = Math.random() * 90;
    fallingSpeed = 3;
    gameRunning = true;
    restartBtn.style.display = "none";
    resetObject();
    dropObject();
}

// Start the game
resetObject();
dropObject();