// UI HTML
const playButton = document.getElementsByClassName('ui-button play')[0];
const gameOverLabel = document.getElementsByClassName('game-over')[0];
const feedButton = document.getElementsByClassName('ui-button feed')[0];
const resetButton = document.getElementsByClassName('ui-button reset')[0];
const gameControls = document.getElementsByClassName('ui-button game-controls');
const scoreLabel = document.getElementsByClassName('score')[0];
const higthScoreLabel = document.getElementsByClassName('h-score')[0];

// Assets HTML
const gameUI = document.getElementsByClassName('game')[0];
const dino = document.getElementsByClassName('dino-sprite')[0];
const ground = document.getElementsByClassName('ground')[0];
const sky = document.getElementsByClassName('sky')[0];

// Audio
var jumpSound = new Audio('./data/JumpSound.mp3');
var gameOverSound = new Audio('./data/gameOverSound.mp3');
var oneHundredSound = new Audio('./data/100sound.mp3');

// Variables
const jumpHeigth = 120;
const jumpSpeed = 10;
let playing = false;
let jumpDinoInterval;
let gameOverBoolean = false;
let spritesCounter = 1;
let score = 0;
let hScore = (localStorage.getItem('hScore')) ? localStorage.getItem('hScore') : 0 ;
let speed = 4;
let groundPosition = 0;
let duck = false;
let jumpPosition = 0;
let jumpState = 0;

// Set Higth score
higthScoreLabel.textContent = hScore.toString().padStart(5,"0");

// Await method
const sleep = async(ms) => new Promise(resolve => setTimeout(resolve, ms));

// Random method
const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
};

// GameOver setting
const gameOver = () => {
    playing = false; 
    gameOverSound.play();
    gameOverBoolean = true;
    gameOverLabel.classList.remove('game-over');
    dino['src'] = `./data/dinoDied.png`;

    if(score > hScore)
        localStorage.setItem('hScore', score);
};

// Dino jump action/animation
const jumpDino = () => {
    dino['src'] = './data/dino.png';
    jumpSound.play();
    let dinoJumpAnimation = setInterval(() => {
        if(jumpState === 0)
            jumpPosition += jumpSpeed;
        else if (jumpState === 1)
            jumpPosition -= jumpSpeed;

        dino.style.bottom = jumpPosition + 'px';      
        
        if (jumpPosition <= 0 || jumpState === 3) {
            clearInterval(dinoJumpAnimation);
            jumpState = 0;
        }     
        else if (jumpPosition >= jumpHeigth) jumpState = 1;
    }, 20);
};

const duckDino = () => {
    duck = true;
    jumpPosition = 0;
    dino.style.bottom = jumpPosition + 'px';
    jumpState = 3;
};

// Cact move action/animation
const cactMove = (cact) => {
    let cactPosition = 700;

    const cactInterval = setInterval(() => {
        if(cactPosition < -100 ) {
            clearInterval(cactInterval);
            cact.parentElement.removeChild(cact);
        }
        else if (playing === false) 
            clearInterval(cactInterval);
        
        else if((cactPosition<60 && cactPosition>0 ) && jumpPosition === 0)
           gameOver();
        
        cactPosition -= speed;
        cact.style.left = cactPosition + 'px';
    }, 20);    
} ;

// Add new cact
const newCact = () => {
    if(playing){
        const rand = getRndInteger(2, 6) * (300 - speed*2);
    
        const cact = document.createElement("div");
        cact.classList.add('cact');
        if (rand%2 > 0) 
            cact.style.width = '23px';
        ground.appendChild(cact);

        cactMove(cact);
    
        setTimeout( () => {
            newCact();  
        }, rand);
    }
};


// Controls configuration
const keyDown = async({keyCode}) => {
    // Analyzing stopped game
    if(playing === false) {

        // Reset Game
        if( gameOverBoolean === true) {
            resetButton.click();
        }

        // Start Game
        else if(keyCode === 32 || keyCode === 38){
            // Configurations
            playing = true;
            jumpDino();

            // Obstacles
            setTimeout(() => {
                newCact();
            }, 500);
            
            // UI
            playButton.classList.remove('floating');
            playButton.classList.add('close');
            feedButton.classList.add('close');
            await sleep(500);
            gameControls[0].classList.add('mobile-mode');
        }
            
    }

    //Jump
    else if ((keyCode === 32 || keyCode === 38) && jumpPosition === 0) {
        jumpDino();
    }

    //Duck
    else if(keyCode === 40) {
        duckDino();
    }
};

// Disable duck
const keyUp = ({keyCode}) => {
    if(keyCode === 40) {
        duck = false;
        jumpState = 0;
    }
};

const groundMove = setInterval(() => {
    if(playing) {
        groundPosition -= speed;
        ground.style.backgroundPosition = groundPosition + 'px 100%';
        sky.style.backgroundPosition = groundPosition/5 + 'px 100%'
    }
    else if (gameOverBoolean)
        clearInterval(groundMove);
}, 20);

// Sprites configuration
setInterval(() => {
    spritesCounter = (spritesCounter === 1) ? 2 : 1;

    if(playing) {
        
        score++;
        if(score%100 === 0)
            oneHundredSound.play();
        const actualScore = score.toString().padStart(5,"0");
        scoreLabel.textContent = actualScore;

        if(hScore < score)
            higthScoreLabel.textContent = actualScore;

        if(duck)
            dino['src'] = `./data/dinoD${spritesCounter}.png`;

        else if(jumpPosition === 0)
            dino['src'] = `./data/dinoR${spritesCounter}.png`;  
    }      
}, 100);

// Speed increase
setInterval(() => {
    if(speed<=20 && playing)
        speed += 0.4;
}, 3000);

// Page presentation
setTimeout(() => {
    playButton.classList.add('floating');
    gameUI.classList.add('scale-in-center');
}, 1000);


// Events
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
gameUI.addEventListener("click", () => keyDown({keyCode: 32}));
playButton.addEventListener("click", () => {keyDown({keyCode: 32})});
gameControls[0].addEventListener("click", () => {keyDown({keyCode: 32})});
