// SELECT CANVAS ELEMENT
const cvs = document.getElementById("sobics");
const ctx = cvs.getContext("2d");

// ADD BORDER TO CANVAS
cvs.style.border = "1px solid black";

// MAKE LINE THIK WHEN DRAWING TO CANVAS
ctx.lineWidth = 3;

// GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 150;
const BALL_RADIUS = 8;
let LIFE = 3; // PLAYER HAS 3 LIVES
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 3;
let GAME_OVER = false;
const img = new Image();
img.src = "img/character.png";
const brickSound = new Audio("sounds/brick.mp3");
const backgroundMusic = new Audio("sounds/music.mp3");
backgroundMusic.loop = true;

// CREATE THE PADDLE
const paddle = {
    x : cvs.width / 2 - PADDLE_WIDTH / 2,
    y : cvs.height - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx :5,
    hasBlock : false,
    blockInHand : null
}

var background = new Image();
background.src = "img/bg.jpg";

// DRAW PADDLE
function drawPaddle(){
    ctx.drawImage(img ,paddle.x, paddle.y, paddle.width, paddle.height);
}

function movePaddle(e){
    ctx.clearRect(paddle.x,paddle.y,paddle.width,paddle.height);
    paddle.x = e;
}

// CREATE THE BRICKS
const brick = {
    row : 5,
    column : 9,
    width : 96,
    height : 40,
    offSetLeft : 13,
    offSetTop : 10,
    marginTop : 40,
    fillColor : "#2e3548",
    strokeColor : "#000"
}

let colors = [
    "#0000FF",
    "#00FF00",
    "#FF0000",
    "#FFFF00",
]

let bricks = [];

function createBricks(){
    for(let c = 0; c < brick.row; c++){
        bricks[c] = [];
        for(let r = 0; r < brick.column; r++){
            bricks[c][r] = {
                x : r * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : c * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                style : colors[Math.floor(Math.random() * colors.length)],
                status : true
            }
        }
    }
}

createBricks();

// draw the bricks
function drawBricks(){
    for(let c = 0; c < bricks.length; c++){
        for(let r = 0; r < bricks[c].length; r++){
            let b = bricks[c][r];
            // if the brick isn't broken
            if(b.status && b !== undefined){
                ctx.fillStyle = b.style;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
    if(paddle.hasBlock){
        ctx.fillStyle = paddle.blockInHand.style;
        ctx.fillRect(paddle.x, paddle.y, brick.width, brick.height);
    } else {
       drawPaddle();
    }
}

// show game stats
function showGameStats(text, textX, textY, img, imgX, imgY){
    // draw text
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    
    // draw image
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// DRAW FUNCTION
function draw(){
    drawPaddle();
    drawBricks();

    // SHOW SCORE
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    // SHOW LIVES
    showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width-55, 5); 
    // SHOW LEVEL
    showGameStats(LEVEL, cvs.width/2, 25, LEVEL_IMG, cvs.width/2 - 30, 5);
}

// game over
function gameOver(){
    if(bricks.length > 10){
        showYouLose();
        GAME_OVER = true;
    }
}

// level up
function levelUp(){
    let isLevelDone = true;
    
    // check if all the bricks are broken
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }
    
    if(isLevelDone){
        WIN.play();
        
        if(LEVEL >= MAX_LEVEL){
            showYouWin();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        LEVEL++;
    }
}

// GAME LOOP
function loop(){
    // CLEAR THE CANVAS
    ctx.drawImage(background,0,0);   

    draw();

    move();

    gameOver();

    if(!GAME_OVER){
        requestAnimationFrame(loop);
    }
}

//Click block
cvs.addEventListener("click", (e) => {
    const rect = cvs.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const cwidth = brick.width + brick.offSetLeft;
    const targetColumn = Math.floor(mouseX / cwidth);
    brickSound.play();
    removeBlock(targetColumn);
});

//mouse move

cvs.addEventListener("mousemove", moveMouse);

function moveMouse(e){
    const x = e.x - PADDLE_WIDTH / 2;
    movePaddle(x);
    if(GAME_OVER){
        cvs.removeEventListener("mousemove", moveMouse);
    }
}

function startGame(){
    cvs.style.display = "block";
    document.getElementById("sound").style.display = "block";
    document.getElementById("myProgress").style.display = "block";
    document.getElementById("button").style.display = "none";
    //backgroundMusic.play();
    loop();
}

// SELECT SOUND ELEMENT
const soundElement  = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager(){
    // CHANGE IMAGE SOUND_ON/OFF
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";
    
    soundElement.setAttribute("src", SOUND_IMG);
    
    WIN.muted = WIN.muted ? false : true;
    if(!WIN.muted){
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}

// SHOW GAME OVER MESSAGE
/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}

function removeBlock(targetColumn){
    let row;
    if(bricks.length - 1 <= 0){
        row = 0;
    } else {
        row = bricks.length - 1;
    }
    if(!paddle.hasBlock){
        if(row > 0){
             while(bricks[row][targetColumn].status != true && row >= 0){
                row--;
            }
        }
        paddle.blockInHand = bricks[row][targetColumn];
        paddle.hasBlock = true;
        const newBrick = {
                x: bricks[row][targetColumn].x,
                y: bricks[row][targetColumn].y,
                style: bricks[row][targetColumn].style,
                status: false,
        };
        bricks[row][targetColumn] = newBrick;
    } else {
        addBlock(targetColumn);
    }
}

function addBlock(targetColumn) {
    var row = bricks.length - 1;
    var n = row;

    while(bricks[row][targetColumn].status != true && n >= 0){
        n--;
        if(n >= 0){
            row = n;
        }
        console.log(n);
    }

    if(n < 0){
        row = 0;
    } else {
        row++;
    }

    console.log(row);

    if(row == bricks.length){
        const newRow = [];
        for (let c = 0; c < brick.column; c++) {
            const newBrick = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: (bricks.length) * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                style: colors[Math.floor(Math.random() * colors.length)],
                status: false,
            };
            newRow.push(newBrick);
        }
        bricks.push(newRow);
    }
    
    paddle.blockInHand.x = targetColumn * (brick.offSetLeft + brick.width) + brick.offSetLeft; // Módosítjuk az x koordinátát az új oszlopon
    paddle.blockInHand.y = row * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop;
    //console.log(paddle.blockInHand.x + " : " + paddle.blockInHand.y);
    bricks[row][targetColumn] = paddle.blockInHand;
    bricks[row][targetColumn].status = true;
    paddle.blockInHand = null;
    paddle.hasBlock = false;
}

function createNewRow() {
  const newRow = [];
  for (let c = brick.column - 1; c >= 0; c--) {
    const newBrick = {
      x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
      y: (bricks.length) * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
      style: colors[Math.floor(Math.random() * colors.length)],
      status: true,
    };
    newRow.push(newBrick);
  }
  bricks.unshift(newRow);
  console.log(bricks.length);
}

var progress = 0;
function move() {
    if (progress == 0) {
        progress = 1;
        var elem = document.getElementById("myBar");
        var width = 1;
        var id = setInterval(frame, 1000);

        function frame() {
            if(!GAME_OVER){
                if (width >= 100) {
                clearInterval(id);
                progress = 0;
                elem.style.width = 0 + "%";
                //createNewRow();
                move();
                } else {
                    width ++;
                    elem.style.width = width + "%";
                }
            }
        }
    }
}

