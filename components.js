/////// LOAD IMAGES ////////

// LOAD BG IMAGE
const BG_IMG = new Image();
BG_IMG.src = "img/bg.jpg";

const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level.png";

const LIFE_IMG = new Image();
LIFE_IMG.src = "img/life.png";

const SCORE_IMG = new Image();
SCORE_IMG.src = "img/score.png";

const CHARACTER_IMG = new Image();
CHARACTER_IMG.src = "img/character.png";

/////// END LOAD IMAGES ////////

/////// LOAD SOUNDS ///////

/*const brickSound = new Audio("sounds/brick.mp3");

const backgroundMusic = new Audio("sounds/music.mp3");
backgroundMusic.loop = true;

const WIN = new Audio("sounds/win.mp3");
*/
const AUDIO = {
    brickSound : new Audio("sounds/brick.mp3"),
    backgroundMusic : new Audio("sounds/music.mp3"),
    WIN : new Audio("sounds/win.mp3")
}

AUDIO.backgroundMusic.loop = true;
/////// END LOAD SOUNDS ///////

// ************************ //