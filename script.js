// DOMcontentLoaded event to ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
    const gameArena = document.getElementById('game-arena');
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0; // score variable
    let gameStarted = false; // game started flag
    let food = { x: 300, y: 200 }; // food object
    let snake = [{ x: 200, y: 200 },{ x: 180, y: 200 }, { x: 160, y: 200 }]; // snake array

    let dx = cellSize; //+20
    let dy = 0;

    let gameSpeed = 200; // game speed in milliseconds

    function drawScoreBoard() {
        const scoreBoard = document.getElementById('score-board');
        if (scoreBoard) {
            scoreBoard.textContent = `Score: ${score}`; // update the score board
        } else {
            const newScoreBoard = document.createElement('div');
            newScoreBoard.id = 'score-board';
            newScoreBoard.textContent = `Score: ${score}`;
            document.body.append(newScoreBoard); // insert score board before game arena
        }
    }


    function updateSnake() {
        const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead); // add new head to the snake. unshift adds an element to the beginning of an array
        // check if the snake has eaten the food
        if(newHead.x === food.x && newHead.y === food.y) {
            score += 1; // increase score by 10
            food.x = Math.floor(Math.random() * (arenaSize / cellSize)) * cellSize; // generate random x position
            food.y = Math.floor(Math.random() * (arenaSize / cellSize)) * cellSize; // generate random y position
            // ensure food is not placed on the snake
            while (snake.some(snakeCell => snakeCell.x === food.x && snakeCell.y === food.y)) {
                food.x = Math.floor(Math.random() * (arenaSize / cellSize)) * cellSize; // generate random x position
                food.y = Math.floor(Math.random() * (arenaSize / cellSize)) * cellSize; // generate random y position
            }
            if(gameSpeed && gameSpeed > 50) {
                clearInterval(intervalId);
                gameSpeed-=10; // clear the interval to increase speed
                gameloop(); // restart the game loop with increased speed
            }


        }
        else {
            snake.pop(); // remove the last element of the snake if food is not eaten
        }
    }

    function changeDirection(event) {
        // console.log(event.key);
        if ((event.key === 'ArrowUp' || event.key === 'w')  && dy === 0) {
            dx = 0;
            dy = -cellSize; // move up
        } else if ((event.key === 'ArrowDown' || event.key === 's') && dy === 0) {
            dx = 0;
            dy = cellSize; // move down
        } else if ((event.key === 'ArrowLeft' || event.key === 'a') && dx === 0) {
            dx = -cellSize; // move left
            dy = 0;
        } else if ((event.key === 'ArrowRight' || event.key === 'd' )&& dx === 0) {
            dx = cellSize; // move right
            dy = 0;
        }
    }

    function drawDiv(x,y,className) {
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }

    function drawFoodandSnake() {
        // Clear the game arena
        gameArena.innerHTML = '';
        // wipe out the game arena before drawing
        snake.forEach((snakeCell) => {
            const snakeElement = drawDiv(snakeCell.x,snakeCell.y,'snake');
            gameArena.appendChild(snakeElement);
        })

        const foodElement = drawDiv(food.x,food.y,'food');
        gameArena.appendChild(foodElement);
    }

    function isgameOver() {
        // check if the snake has collided with itself
        for (let i = 1; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return true; // game over if the snake collides with itself
            }
        }

        // check if the snake has collided with the walls
        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x >= arenaSize; 
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y >= arenaSize;

        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;

    }

    function gameOver() {
        initiateGame(); // reset the game
    }

    function displayGameOverMessage() {
        const gameOverMessage = document.createElement('div');
        gameOverMessage.id = 'game-over-message';
        gameOverMessage.textContent = `Game Over! Your score is ${score}.`;
        document.body.appendChild(gameOverMessage);
        gameArena.style.display = 'none'; // hide the game arena
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.style.display = 'none'; // hide the score board
        gameOverMessage.style.display = 'block'; // show the game over message

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.classList.add('restart-button');
        document.body.appendChild(restartButton);
        restartButton.addEventListener('click', function() { 
            document.body.removeChild(gameOverMessage); // remove the game over message
            document.body.removeChild(restartButton); // remove the restart button
            scoreBoard.style.display = 'block'; // show the score board
            gameOver();
        });
    }
    


    function gameloop() {
        intervalId = setInterval(() => {
            if(isgameOver()) {
            clearInterval(intervalId);
            displayGameOverMessage();
            // gameOver();
            return;
        }
            drawFoodandSnake();
            updateSnake();
            drawScoreBoard(); // update the snake position
             // draw the food and snake
            },gameSpeed); // 100 milliseconds interval
        }

    function runGame(){
        if(!gameStarted) {
            gameStarted = true;
            document.addEventListener('keydown', changeDirection); // add event listener for keydown
            gameloop(); // TODO: Implement the game loop 
            
        }
    }

    function initiateGame() {
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-Board';
        document.body.insertBefore(scoreBoard, gameArena); // insert score board before game arena
        
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');

        document.body.appendChild(startButton);

        const imgdiv = document.getElementById('img-div');

        startButton.style.display = 'block';
        imgdiv.style.display = 'block'; // hide the image div
        gameArena.style.display = 'none';

        score = 0; // score variable
        gameStarted = false; // game started flag
        food = { x: 300, y: 200 }; // food object
        snake = [{ x: 200, y: 200 },{ x: 180, y: 200 }, { x: 160, y: 200 }]; // snake array

        dx = cellSize; //+20
        dy = 0;

        gameSpeed = 200;


        startButton.addEventListener('click', function startGame(){
            startButton.style.display = 'none';
            imgdiv.style.display = 'none'; // hide the image div
            gameArena.style.display = 'block'; // show the game arena

            runGame();
        });

    }

    initiateGame();  


});
