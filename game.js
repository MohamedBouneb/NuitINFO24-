// Références aux éléments HTML
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startGame');

// Ajouter un bouton "Rejouer" et masquer le bouton "Start Game"
const replayButton = document.createElement('button');
replayButton.textContent = 'Rejouer';
replayButton.style.display = 'none'; // Cacher initialement
replayButton.id = 'replayButton';
replayButton.className = startButton.className; // Copier les styles du bouton "Start Game"
replayButton.addEventListener('click', restartGame);

// Insérer le bouton "Rejouer" à côté du bouton "Start Game"
startButton.parentNode.insertBefore(replayButton, startButton.nextSibling);

// Charger les images
const mapImg = new Image();
mapImg.src = 'map.png'; // Assurez-vous que l'image est dans le même dossier

const turtleImg = new Image();
turtleImg.src = 'tortue.png';

const sackImg = new Image();
sackImg.src = 'sac.png';

// Générer des points de départ et de fin aléatoires
function getRandomStartAndEnd() {
    return {
        startX: 10, // Tortue commence toujours à gauche (Amérique)
        startY: Math.random() * (canvas.height - 40), // Y aléatoire dans le canvas
        endX: canvas.width - 50, // Tortue termine toujours à droite (France)
        endY: Math.random() * (canvas.height - 10) // Y aléatoire pour le point de victoire
    };
}

// Définir les points de départ et de fin
let positions = getRandomStartAndEnd();

// Position initiale de la tortue
let turtleX = positions.startX;
let turtleY = positions.startY;

// Point de fin
let endPointX = positions.endX;
let endPointY = positions.endY;

// Position des sacs
const sacks = [
    { x: 400, y: Math.random() * (canvas.height - 40) },
    { x: 500, y: Math.random() * (canvas.height - 40) }
];

// Variables du jeu
let isGameRunning = false;
let score = 0;

// Mouvement de la tortue
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && turtleY > 0) turtleY -= 15;
    if (event.key === 'ArrowDown' && turtleY < canvas.height - 40) turtleY += 15;
    if (event.key === 'ArrowRight' && turtleX < canvas.width - 40) turtleX += 15; // Avancer vers la droite
    if (event.key === 'ArrowLeft' && turtleX > 0) turtleX -= 15; // Reculer vers la gauche
});

// Démarrer le jeu
startButton.addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        score = 0;
        replayButton.style.display = 'none'; // Cacher le bouton "Rejouer"
        startButton.style.display = 'none'; // Masquer le bouton "Start Game"
        positions = getRandomStartAndEnd(); // Régénérer points aléatoires
        turtleX = positions.startX;
        turtleY = positions.startY;
        endPointX = positions.endX;
        endPointY = positions.endY;
        gameLoop();
    }
});

// Boucle principale du jeu
function gameLoop() {
    if (!isGameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas
    drawMap();
    drawTurtle();
    drawEndPoint(); // Dessiner le point de fin
    drawSacks();
    detectCollision();
    checkWinCondition(); // Vérifie si la tortue a atteint la France

    requestAnimationFrame(gameLoop);
}

// Dessiner la carte
function drawMap() {
    ctx.drawImage(mapImg, 0, 0, canvas.width, canvas.height); // Adapter la carte à la taille du canvas
}

// Dessiner la tortue
function drawTurtle() {
    ctx.drawImage(turtleImg, turtleX, turtleY, 30, 30); // Tortue 30x30 px
}

// Dessiner le point de fin
function drawEndPoint() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(endPointX, endPointY, 15, 0, Math.PI * 2); // Cercle rouge pour l'europe
    ctx.fill();
}

// Dessiner les sacs
function drawSacks() {
    sacks.forEach((sack, index) => {
        ctx.drawImage(sackImg, sack.x, sack.y, 20, 20); // Sac réduit à 20x20 px
        sack.x -= 4; // Déplacement des sacs vers la gauche

        // Réinitialiser les sacs lorsqu'ils quittent l'écran
        if (sack.x < -20) {
            sack.x = 400 + Math.random() * 200;
            sack.y = Math.random() * (canvas.height - 40);
            score++; // Augmenter le score lorsqu'un sac est évité
        }
    });
}

// Détecter les collisions
function detectCollision() {
    sacks.forEach((sack) => {
        if (
            turtleX < sack.x + 10 &&
            turtleX + 20 > sack.x &&
            turtleY < sack.y + 10 &&
            turtleY + 20 > sack.y
        ) {
            isGameRunning = false; // Arrêter le jeu
            startButton.style.display = 'none';
            replayButton.style.display = 'block'; // Afficher le bouton "Rejouer"
            alert('Replay !');
        }
    });
}

// Vérifier la condition de victoire
function checkWinCondition() {
    const distance = Math.sqrt(
        (turtleX - endPointX) ** 2 + (turtleY - endPointY) ** 2
    );
    if (distance < 20) { // Si la tortue atteint le point de fin
        isGameRunning = false;
        window.location.href = 'https://www.viveris.fr/';
    }
}

// Réinitialiser le jeu
function restartGame() {
    isGameRunning = false;
    score = 0;
    replayButton.style.display = 'none'; // Cacher le bouton "Rejouer"
    startButton.style.display = 'block'; // Réafficher le bouton "Start Game"
    positions = getRandomStartAndEnd();
    turtleX = positions.startX;
    turtleY = positions.startY;
    endPointX = positions.endX;
    endPointY = positions.endY;
    sacks.forEach(sack => {
        sack.x = 400 + Math.random() * 200;
        sack.y = Math.random() * (canvas.height - 40);
    });
    isGameRunning = true;
    gameLoop();
}
