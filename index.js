// HTML
const dino = document.getElementsByClassName('dino-sprite')[0];
const playButton = document.getElementsByClassName('ui-button play')[0];
const ground = document.getElementsByClassName('ground')[0];
const feedButton = document.getElementsByClassName('ui-button feed')[0];
const scoreLabel = document.getElementsByClassName('score')[0];
const higthScoreLabel = document.getElementsByClassName('h-score')[0];
const gameUI = document.getElementsByClassName('game')[0];


// Variables
let playing = false;
let duck = false;
let spritesCounter = 1;
let score = 0;
let speed = 5;
let hScore = (localStorage.getItem('hScore')) ? localStorage.getItem('hScore') : 0 ;


// Methods
const sleep = async(ms) => new Promise(resolve => setTimeout(resolve, ms));

const keyDown = async({keyCode}) => {
    console.log(keyCode);

    if(playing === false && (keyCode === 32 || keyCode === 38)) {
        playing = true;
        ground.setAttribute('style', `animation: ground-move ${speed}s 0.6s infinite linear both;`);
        playButton.classList.remove('floating');
        playButton.classList.add('close');
        feedButton.classList.add('close');
    }

    if ((keyCode === 32 || keyCode === 38) && !dino.className.includes('jump')) {
        dino['src'] = './data/dino.png';
        dino.classList.add('jump');
        await sleep(500);
        if(dino.className.includes('jump')) {
            dino.classList.remove('jump');
            dino['src'] = './data/dino.png';
        }
    }

    else if(keyCode === 40) {
        dino.classList.remove('jump');
        duck = true;
    }
};

const keyUp = ({keyCode}) => {
    if(keyCode === 40)
        duck = false;
};


// Main
higthScoreLabel.textContent = hScore.toString().padStart(5,"0");

setInterval(() => {
    spritesCounter = (spritesCounter === 1) ? 2 : 1;

    if(playing) {
        
        score++;
        const actualScore = score.toString().padStart(5,"0");
        scoreLabel.textContent = actualScore;

        if(hScore < score)
            higthScoreLabel.textContent = actualScore;

        if(duck)
            dino['src'] = `./data/dinoD${spritesCounter}.png`;

        else if(!dino.className.includes('jump'))
            dino['src'] = `./data/dinoR${spritesCounter}.png`;  

    }      
}, 100);

setInterval(() => {
    if(speed>1.5 && playing) {
        speed -= 0.4;
        ground.setAttribute('style', `animation: ground-move ${speed}s infinite linear both;`);
    }
}, 10000);

setTimeout(() => {
    playButton.classList.add('floating');
    gameUI.classList.add('scale-in-center');
}, 1000);


// Events
window.addEventListener("keydown", keyDown);
gameUI.addEventListener("click", () => keyDown({keyCode: 32}));
window.addEventListener("keyup", keyUp);
playButton.addEventListener("click", () => {keyDown({keyCode: 32})});
