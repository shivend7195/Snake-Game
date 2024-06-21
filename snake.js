const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [];
snake[0] = {x : 9 * box, y:10 * box};

let food = {
    x : Math.floor(Math.random()* 17 + 1)* box,
    y : Math.floor(Math.random()* 15 + 3)* box
};

let score = 0;
let d;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach((segment, index) => {
        ctx.fillStyle = index == 0 ? "green" : "brown";
        ctx.fillRect(segment.x, segment.y, box, box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(segment.x, segment.y, box, box);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

   
    ctx.fillStyle = "white";
    ctx.font = "30px 'Changa One', cursive";
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${score}`, canvas.width / 2, 1.5 * box);
}


document.addEventListener("keydown", direction);

function direction(event){
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT"){
        d = "LEFT";
    }else if (key == 38 && d != "DOWN"){
        d = "UP"
    }else if (key == 39 && d != "LEFT"){
        d = "RIGHT"
    }else if (key == 40 && d != "UP"){
        d = "DOWN";
    }
}

function updateSnakePosition(){
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(d == "LEFT")snakeX -= box;
    if(d == "UP")snakeY -= box;
    if(d == "RIGHT")snakeX += box;
    if(d == "DOWN")snakeY += box;

    if (snakeX == food.x && snakeY == food.y){
        score ++;
        food={
            x : Math.floor(Math.random()* 17 +1)*box,
            y : Math.floor(Math.random() * 15 + 3)*box
        };
    }else{
        snake.pop();
    }

    let newHead ={
        x : snakeX,
        y : snakeY
    };

    if(snakeX < 0*box || snakeY < 0 * box || snakeX > 19 * box || snakeY > 19 * box || collision(newHead, snake)){
        newHead = actOnCollision();
    }
    snake.unshift(newHead);
}

function collision(head, array){
    for(let i = 0; i<array.length; i++){
        if (head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

function actOnCollision(){
    d = "STOP";
    snake = [];
    score = 0;
    return { x : 9 * box, y: 10 * box};
}

function game(){
    setTimeout(function onTick(){
        draw();
        updateSnakePosition();
        game();

    }, 150);
}
game();

// Initialize leaderboard if not present in localStorage
if (!localStorage.getItem('leaderboard')) {
    localStorage.setItem('leaderboard', JSON.stringify([]));
}
let leaderboard = JSON.parse(localStorage.getItem('leaderboard'));

// Function to update the leaderboard with new score and player name
function updateLeaderboard(score, playerName) {
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 5) {
        leaderboard.pop();
    }
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Function to display the leaderboard
function displayLeaderboard() {
    let leaderboardElement = document.getElementById('leaderboard-body');
    leaderboardElement.innerHTML = '';

    leaderboard.forEach((entry, index) => {
        let row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td><td>${entry.name}</td><td>${entry.score}</td>`;
        leaderboardElement.appendChild(row);
    });
}

// Function to handle game over scenario
function onGameOver(score) {
    let playerName = prompt("Game Over! Enter your name:");
    if (playerName) {
        updateLeaderboard(score, playerName);
        // Call displayLeaderboard here to show the updated list (top 5):
        displayLeaderboard();
    }
}


// Collision handling function
function actOnCollision() {
    d = "STOP";
    snake = [];
    onGameOver(score);
    score = 0;
    return { x: 9 * box, y: 10 * box };
}

// Display leaderboard on page load
window.onload = function() {
    displayLeaderboard();
}



