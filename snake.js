const ansi = require('ansi');
const keypress = require('keypress');
var cursor = ansi(process.stdout);

const width = 40;
const height = 20;


var snakeX = width / 2;
var snakeY = height / 2;
var appleX;
var appleY;
var gameOver = false;
var points = 0;
var speed = 1;
var changesX = 1;
var changesY = 0;

var speed = 1;


process.stdout.write('\x1Bc');
process.stdout.write('\x1B[?25l');
cursor.bg.grey();
drawGameField();
LookForKeypress();
drawSnake();
generateApple();
drawApple();
game();

function game() {
    cursor.goto(0, height + 1).write('Points: ' + points);
    cursor.goto(0, height + 2).write('Speed: ' + speed);
    checkCollision();
    if (gameOver) {
        cursor.reset();
        cursor.bg.red();
        cursor.goto(width/2-5, height/2).write('GAME OVER');
        cursor.bg.reset();
        process.exit();
    }
    drawSnake();
    setTimeout(game, 1000 / speed);
}

function checkCollision() {
    if (snakeX >= width || snakeY >= height || snakeX <= 1 || snakeY <= 1) {
        gameOver = true;
    }
    if (snakeX == appleX && snakeY == appleY) {
        points += 1;
        speed += 1;
        generateApple();
        drawApple();
    }
}

function drawApple() {
    cursor.bg.red();
    cursor.goto(appleX, appleY).write(' ');
    cursor.bg.reset();
}

function generateApple() {
    appleX = Math.floor(Math.random() * (width - 2) + 2);
    appleY = Math.floor(Math.random() * (height - 2) + 2);
}

function drawSnake() {
    cursor.bg.reset();
    cursor.goto(snakeX, snakeY).write(' ');
    cursor.bg.green();
    snakeX += changesX;
    snakeY += changesY;
    cursor.goto(snakeX, snakeY).write(' ');
    cursor.bg.reset();
}

function drawGameField() {
    cursor.bg.grey();
    drawHorizontalLine(1, 1, width);
    drawVerticalLine(width, 1, height);
    drawHorizontalLine(1, height, width);
    drawVerticalLine(1, 1, height);
    cursor.bg.reset();
}

function drawHorizontalLine(col, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(col + i, row).write(' ');
    }
}

function drawVerticalLine(col, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(col, row + i).write(' ');
    }
}

function LookForKeypress() {
    keypress(process.stdin);
    // listen for the "keypress" event
    process.stdin.on('keypress', function (ch, key) {
        if (key && key.ctrl && key.name == 'c') {
            process.stdin.pause();
        }

        switch (key.name) {
            case "up": if (changesY != 1) { changesX = 0; changesY = -1 }; break;
            case "down": if (changesY != -1) { changesX = 0; changesY = 1 }; break;
            case "left": if (changesX != 1) { changesX = -1; changesY = 0 }; break;
            case "right": if (changesX != 1) { changesX = 1; changesY = 0 };
        }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();
}

