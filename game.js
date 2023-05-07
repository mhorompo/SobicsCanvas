// SELECT CANVAS ELEMENT
const cvs = document.getElementById("sobics");
const ctx = cvs.getContext("2d");

// ADD BORDER TO CANVAS
cvs.style.border = "1px solid black";

// MAKE LINE THIK WHEN DRAWING TO CANVAS
ctx.lineWidth = 3;

// GAME VARIABLES AND CONSTANTS
const CHARACTER_WIDTH = 100;
const CHARACTER_MARGIN_BOTTOM = 50;
const CHARACTER_HEIGHT = 150;
let PLAYER_NAME;
let MUTED = false;
let SCORE = 0;
let LEVEL = 1;
const MAX_LEVEL = 3;
let GAME_OVER = false;
let intervalTime = 150;
var elem = document.getElementById("myBar");

// CREATE THE CHARACTER
const character = {
    x : cvs.width / 2 - CHARACTER_WIDTH / 2,
    y : cvs.height - CHARACTER_HEIGHT,
    width : CHARACTER_WIDTH,
    height : CHARACTER_HEIGHT,
    dx :5,
    hasBlock : false,
    blockInHand : null
}

// DRAW CHARACTER

function drawCharacter(){
    ctx.drawImage(CHARACTER_IMG ,character.x, cvs.height - CHARACTER_HEIGHT, character.width, character.height);
}

function moveCharacter(e){
    ctx.clearRect(character.x,character.y,character.width,character.height);
    character.x = e;
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
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                style : colors[Math.floor(Math.random() * colors.length)],
                status : true
            }
        }
    }
}

// DRAW OUT THE BRICKS
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
    if(character.hasBlock){
        ctx.fillStyle = character.blockInHand.style;
        ctx.fillRect(character.x, character.y, brick.width, brick.height);

        ctx.strokeStyle = brick.strokeColor;
        ctx.strokeRect(character.x, character.y, brick.width, brick.height);
    } else {
       drawCharacter();
    }
}

// SHOW GAME STATS
function showGameStats(text, textX, textY, img, imgX, imgY){
    // DRAW TEXT
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    
    // DRAW IMAGE
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// DRAW FUNCTION
function draw(){
    drawCharacter();
    drawBricks();

    // SHOW SCORE
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    // SHOW LEVEL
    showGameStats(LEVEL, cvs.width - 30, 25, LEVEL_IMG, cvs.width - 60, 5); 
}

// GAME OVER
function gameOver(){
    if(bricks.length > 10){
        showYouLose();
        saveScore();
        GAME_OVER = true;
    }
    if(LEVEL == MAX_LEVEL + 1){
        hideLevelUp();
        saveScore();
        showYouWin();
        GAME_OVER = true;
    }
}

// LEVEL UP
function levelUp(){
    showLevelUp();
    AUDIO.WIN.play();
    intervalTime -= 50; // Csökkentsük az intervalTime értékét

    clearInterval(id);
    progress = 0;
    elem.style.width = 0 + "%";

    // Töröljük az összes meglévő téglát
    bricks = [];
    LEVEL++;
}

function saveScore(){
    const scores = {
        player : PLAYER_NAME,
        score : parseInt(SCORE)
    };

    if (localStorage.getItem("leaderboard")) {
        var array = JSON.parse(localStorage.getItem("leaderboard"));
        array.push(scores);
        localStorage.setItem("leaderboard", JSON.stringify(array));
    } else {
        localStorage.setItem("leaderboard", JSON.stringify([scores]));
    }
}

// GAME LOOP
function loop(){
    // CLEAR THE CANVAS
    ctx.drawImage(BG_IMG,0,0);   

    draw();

    gameOver();

    if(!GAME_OVER){
        requestAnimationFrame(loop);
    }
}

// MAIN CLICK EVENT
cvs.addEventListener("click", (e) => {
    const rect = cvs.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const cwidth = brick.width + brick.offSetLeft;
    const targetColumn = Math.floor(mouseX / cwidth);
    AUDIO.brickSound.play();
    removeBlock(targetColumn);
});

// MOUSE CONTORLS
cvs.addEventListener("mousemove", moveMouse);

function moveMouse(e){
    const x = e.x - CHARACTER_WIDTH / 2;
    moveCharacter(x);
    if(GAME_OVER){
        cvs.removeEventListener("mousemove", moveMouse);
    }
}

function startGame(){
    PLAYER_NAME = document.getElementById("playername").value;
    cvs.style.display = "block";
    createBricks();
    document.getElementById("sound").style.display = "block";
    document.getElementById("myProgress").style.display = "block";
    document.getElementById("button").style.display = "none";
    document.getElementById("playername").style.display = "none";
    AUDIO.backgroundMusic.play();
    move(intervalTime);
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
    
    toggleMute();
}

 function toggleMute() {
    for (var i in AUDIO) {
        AUDIO[i].muted = !AUDIO[i].muted;
    }
 }

// SHOW GAME OVER MESSAGE
/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");
const levelup = document.getElementById("levelup");
const level = document.getElementById("level");
const continueB = document.getElementById("continue");
const leaderboard = document.getElementById("leaderboard");
const cont = document.getElementById("cont");
const restarttable = document.getElementById("restarttable");

// CLICL ON LEADERBOARD
leaderboard.addEventListener("click", () => {
    hideYouWin();
    showLeaderBoard();
})

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

restarttable.addEventListener("click", () =>{
    location.reload();
})

// CLICK ON LEVEL UP BUTTON
continueB.addEventListener("click", () => {
    hideLevelUp();
    createBricks(); // Újrapályázzuk a játékot
    move(intervalTime);
    loop();
})

// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

function hideYouWin(){
    gameover.style.display = "none";
    youwon.style.display = "none";
}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}

// SHOW LEVEL UP
function showLevelUp(){
    levelup.style.display = "block";
    level.style.display = "block";
}

// HIDE LEVEL UP
function hideLevelUp(){
    levelup.style.display = "none";
    level.style.display = "none";
}

// SHOW LEADERBOARD
function showLeaderBoard(){
    table.style.display = "block";
    leaderboard.style.display = "block";
    const array = JSON.parse(localStorage.getItem("leaderboard"));
    for(let i = 0; i < array.length; i ++){
        let p = document.createElement("p");
        p.innerHTML = array[i].player + " : " + array[i].score;
        cont.append(p);
    }
    restarttable.style.display = "block";
}

// REMOVE BLOCK
function removeBlock(targetColumn){
    let row;
    if(bricks.length - 1 <= 0){
        row = 0;
    } else {
        row = bricks.length - 1;
    }
    if(!character.hasBlock){
        if(row > 0){
             while(bricks[row][targetColumn].status != true && row >= 0){
                row--;
            }
        }
        character.blockInHand = bricks[row][targetColumn];
        character.hasBlock = true;
        const newBrick = {
                x: bricks[row][targetColumn].x,
                y: bricks[row][targetColumn].y,
                style: bricks[row][targetColumn].style,
                status: true,
        };
        setInterval(() => {
            newBrick.y += 40;
        }, 10);
        setTimeout(() => {
            newBrick.status = false;
        }, 100);
        bricks[row][targetColumn] = newBrick;
    } else {
        addBlock(targetColumn);
    }
}

// ADD BLOCK
function addBlock(targetColumn) {
    var row = bricks.length - 1;
    var n = row;

    while(bricks[row][targetColumn].status != true && n >= 0){
        n--;
        if(n >= 0){
            row = n;
        }
    }

    if(n < 0){
        row = 0;
    } else {
        row++;
    }

    if(row == bricks.length){
        const newRow = [];
        for (let c = 0; c < brick.column; c++) {
            const newBrick = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: (bricks.length) * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                style: "#FFF",
                status: false,
            };
            newRow.push(newBrick);
        }
        bricks.push(newRow);
    }

    let lastBrickStyle = character.blockInHand.style;
    
    character.blockInHand.x = targetColumn * (brick.offSetLeft + brick.width) + brick.offSetLeft; // Módosítjuk az x koordinátát az új oszlopon
    character.blockInHand.y = row * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop;
    bricks[row][targetColumn] = character.blockInHand;
    bricks[row][targetColumn].status = true;
    character.blockInHand = null;
    character.hasBlock = false;

    checkAdjacentBlocks(targetColumn, lastBrickStyle);
}

// CREATE A NEW ROW
function createNewRow() {
    const newRow = [];
    for (let c = 0; c < brick.column; c++) {
        const newBrick = {
            x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
            y: brick.offSetLeft + brick.marginTop,
            style: colors[Math.floor(Math.random() * colors.length)],
            status: true,
        };
        newRow.push(newBrick);
    }

    for(let c = 0; c < bricks.length; c++){
        for(let r = 0; r < bricks[c].length; r++){
            let b = bricks[c][r];
            // if the brick isn't broken
            b.y += brick.marginTop + brick.offSetTop;
        }
    }

    bricks.unshift(newRow);
}

// PROGRESS BAR
var progress = 0;
var id;
function move(intervalTime) {
    if (progress == 0) {
        progress = 1;
        var width = 1;
        id = setInterval(frame, intervalTime);

        function frame() {
            if(!GAME_OVER){
                if (width >= 100) {
                clearInterval(id);
                progress = 0;
                elem.style.width = 0 + "%";
                createNewRow();
                move(intervalTime);
                } else {
                    width ++;
                    elem.style.width = width + "%";
                }
            }
        }
    }
}

// CHECK BRICKS FOR POINTS
function checkAdjacentBlocks(targetColumn, lastBrickStyle) {
    let count = 0;
    for(let i = bricks.length - 1; i >= 0 ; i--){
        let elementInColumn = bricks[i][targetColumn];
        if(elementInColumn.style != lastBrickStyle){
            break;
        } else {
            count ++;
        }
    }
    if(count >= 4){
        for(let i = bricks.length - 1; i >= 0 ; i--){
        let elementInColumn = bricks[i][targetColumn];
        if(elementInColumn.style != lastBrickStyle){
            break;
        } else {
            elementInColumn.status = false;
            achviceScore();
        }
    }
    }
}

// SCORE SOME POINTS
function achviceScore(){
    SCORE += 1000;
    if(LEVEL == 1 && SCORE >= 8000){
        levelUp();
    }
    if(LEVEL == 2 && SCORE >= 20000){
        levelUp();
    }
    if(LEVEL == 3 && SCORE >= 38000){
        levelUp();
    }
}