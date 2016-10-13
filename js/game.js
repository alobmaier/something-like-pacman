/**
 * Created by Andreas on 23.01.2016.
 */


/*keycodes*/
var leftKey = 37;
var rightKey = 39;
var upKey = 38;
var downKey = 40;
var pauseKey = 80;

/*highscore*/
var highscore_arr = [];

/*constant values*/
var CELL_SIZE = 32;
var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 512;
var GRID_WIDTH = SCREEN_WIDTH / CELL_SIZE;
var GRID_HEIGHT = SCREEN_HEIGHT / CELL_SIZE;
var renderSpeed = 50; //ms
var gameSpeed = 250; //ms
var pacman;
var levelcount = 1;
var blinky, pinky, inky, clyde;

var pause = true; //default pause
var overlayActive = true;
var gameOver = false;

var angle1 = 0.25, angle2 = 1.75;
var score = 0;

//-- interval id's
var gameLoopId;
var renderId;

// -- canvas
var gamecontainer;
var canvas = document.createElement('canvas');
var renderingContext = canvas.getContext('2d');
var images = {};
// -- levels
var levelPath = "img/level_1.png";
var levelImage;
var levelLoaded = false;
var level;

// -- sound management
var pacmanWaka, pacmanOpening, pacmanDies;

var up = new Direction("up",1.75,1.25,0,-1);		// UP
var left = new Direction("left",1.25,0.75,-1,0);	// LEFT
var down = new Direction("down",0.75,0.25,0,1);		// DOWN
var right = new Direction("right",0.25,1.75,1,0);	// RIGHT
var none = new Direction("none", 0.25,1.75,0,0); // stop


$(document).ready(function ()
{
    // -- setup audio api
    try {
        // Fix up for prefixing
        //window.AudioContext = window.AudioContext||window.webkitAudioContext;
       // audioContext = new AudioContext();

        pacmanWaka = document.querySelector('#pacmanWaka');
        pacmanWaka.volume = 0.2;
        pacmanOpening = document.querySelector('#pacmanOpening');
        pacmanDies = document.querySelector('#pacmanDies');
        //var src = audioContext.createMediaElementSource(pacmanWaka);
        //src.connect(audioContext.destination);
        pacmanOpening.play();
    }
    catch(e) {
        alert(e);
        alert('Web Audio API is not supported in this browser');
    }

    init();
    $('#game_overlay').click(function()
    {
        if(!gameOver) {
            $('#game_overlay').fadeOut(400);
            pause = false;
            overlayActive = false;
        }
    });
    window.addEventListener('keydown', function(event)
    {
        console.log(event.keyCode);
        var key = event.keyCode;

        if (key == leftKey && !pacman.dead) {
            if (pacman.direction != left) {

                pacman.setDirection(left);
                checkCollision();
                pacman.startAngle = pacman.direction.angle1;
                pacman.endAngle = pacman.direction.angle2;
                //pacman.checkDirection();

                //set eye position
                pacman.eyePosX = -pacman.radius / 4;
                pacman.eyePosY = -pacman.radius / 1.7;


            }
        }
        if (key == rightKey && !pacman.dead) {
            if (pacman.direction != right) {
                pacman.setDirection(right);
                checkCollision();
                pacman.startAngle = pacman.direction.angle1;
                pacman.endAngle = pacman.direction.angle2;
                //pacman.checkDirection();

                //set eye position
                pacman.eyePosX = pacman.radius / 4;
                pacman.eyePosY = -pacman.radius / 1.7;
            }
        }
        if (key == upKey && !pacman.dead) {
            if (pacman.direction != up) {
                pacman.setDirection(up);
                checkCollision();
                pacman.startAngle = pacman.direction.angle1;
                pacman.endAngle = pacman.direction.angle2;
                //pacman.checkDirection();

                //set eye position
                pacman.eyePosX = pacman.radius / 1.7;
                pacman.eyePosY = -pacman.radius / 4;
            }
        }
        if (key == downKey && !pacman.dead) {
            if (pacman.direction != down) {
                pacman.setDirection(down);
                checkCollision();
                pacman.startAngle = pacman.direction.angle1;
                pacman.endAngle = pacman.direction.angle2;
                //pacman.checkDirection();

                //set eye position
                pacman.eyePosX = pacman.radius / 1.7;
                pacman.eyePosY = pacman.radius / 4;
            }
        }
        if(key == pauseKey && !this.gameOver)
        {
            this.pause = !this.pause;
            $('#title').html('Click or Press P <br> to resume');
            if(!this.pause)
                $('#game_overlay').fadeOut(300);
            else
                $('#game_overlay').fadeIn(300);
        }



    }, false);


    levelImage.onload = function() {
        levelLoaded = true;
        level = new Level(levelImage, renderingContext);
        pacman = new Pacman(level);
        //set start position
        pacman.posX = CELL_SIZE + pacman.radius;
        pacman.posY = CELL_SIZE + pacman.radius;
        pacman.eyePosX = pacman.radius/4;
        pacman.eyePosY = -pacman.radius / 1.7;
        pacman.setDirection(none);
        pacman.startAngle = right.angle1;
        pacman.endAngle = right.angle2;

        //set up ghosts
        blinky = new Ghost('blinky', 'img/blinky.svg', 9, 8);
        pinky = new Ghost('pinky', 'img/pinky.svg', 10,8);
        inky = new Ghost('inky', 'img/inky.svg', 9, 7);
        clyde = new Ghost('clyde', 'img/clyde.svg', 10, 7);
        level.createDots();
        //blinky.setDirection(left);
        // --
        renderId = setInterval(render, renderSpeed);
        gameLoopId = setInterval(gameLoop, gameSpeed);
        //directionId = setInterval(pacman.checkDirection, gameSpeed);
    }



});


// -- initialization
function init()
{
    /*container setup*/
    gamecontainer = document.getElementById('game_container');

    /*highscore setup?*/
    if(localStorage["highscores"] != undefined)
        highscore_arr = JSON.parse(localStorage['highscores']);

    /*canvas setup*/
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;


    gamecontainer.appendChild(canvas);
    canvas.id += "game-canvas";


    images["level"] = new Image();
    images["level"].src = levelPath;

    levelImage = images["level"];

    $('#submit_highscore').click(storeHighscore);



}
function checkDots()
{
    var rowX, columnY;
    rowX = pacman.getPosX();
    columnY = pacman.getPosY();

    if(level.cellData[rowX][columnY] == 1)
    {
        level.dots[rowX][columnY].eat();
    }

}
function checkCollision() //TODO
{
    //check if pacman in bounds
    var pX = pacman.getPosX();
    var pY = pacman.getPosY();

    if(pX == blinky.getPosX() && pY == blinky.getPosY())
    {

        pacman.stop();
        pacman.die();
        blinky.reset();
    }
    if(pX == pinky.getPosX() && pY == pinky.getPosY())
    {

        pacman.stop();
        pacman.die();
        pinky.reset();
    }
    else if(pX == inky.getPosX() && pY == inky.getPosY())
    {

        pacman.stop();
        pacman.die();
        inky.reset();
    }
    else if(pX == clyde.getPosX() && pY == clyde.getPosY())
    {

        pacman.stop();
        pacman.die();
        clyde.reset();
    }

    switch(pacman.direction) {
        case left:

            if((pX-1)>=0) {
                if (level.cellData[pX - 1][pY] == 0) {
                    pacman.stop();
                }
            }
            break;
        case right:
            if((pX+1)<= SCREEN_WIDTH/CELL_SIZE) {
                if (level.cellData[pX + 1][pY] == 0) {
                    pacman.stop();
                }
            }
            break;
        case up:
            if((pY-1)>=0) {
                if (level.cellData[pX][pY - 1] == 0) {
                    pacman.stop();
                }
            }
            break;
        case down:
            if((pY+1)<= SCREEN_HEIGHT / CELL_SIZE) {
                if (level.cellData[pX][pY + 1] == 0) {
                    pacman.stop();
                }
            }
            break;
    }

}
function checkGameOver()
{
        //TODO
    if(pacman.lives <= 0)
    {
        $('#game_overlay').unbind("click");
        //game over

        setTimeout(function() {
            clearInterval(renderId)
        }, 1000);
        clearInterval(gameLoopId);


        $('#title').html('Game Over')
        var text = document.createElement('h3');
        $(text).html('Please enter your name');
        $('#game_overlay').fadeIn(200);


        $('#highscore_input').addClass('show');

        this.gameOver = true;



    }


}
function checkLevelCompleted()
{
    if(pacman.totalEatenDots == level.totalDots)
    {

        clearInterval(gameLoopId);
        clearInterval(renderId);

        $('#title').html('Level Completed!')
        var text = document.createElement('h3');
        $(text).html('Please enter your name');
        $('#game_overlay').fadeIn(200);

        $('#highscore_input').addClass('show');

        this.gameOver = true;
    }
}

function render()
{
    if(!this.pause) {
        pacman.renderContent();
        blinky.renderContent();
        pinky.renderContent();
        inky.renderContent();
        clyde.renderContent();
        pacman.setAngles();

        checkDots();
    }
}
function gameLoop()
{
    if(!this.pause && !this.overlayActive)
    {

         //moves pacman and checks direction
        //blinky.checkDirection();


        checkCollision();
        pacman.move();
        blinky.move();
        pinky.move();

        if(pacman.totalEatenDots >= 30)
            inky.move();
        if(pacman.totalEatenDots >= (level.totalDots * 0,66))
            clyde.move();

        checkGameOver();
        checkLevelCompleted();


        //setTimeout(gameLoop, 150);
    }
}


function storeHighscore()
{
    var result = {};
    var player = $('#input_name').val();

    if(player != undefined && player != "") {

        result = {player: player, score: score};
        highscore_arr.push(result);
        highscore_arr.sort(function (a, b) {
            return b.score - a.score;
        });

        localStorage['highscores'] = JSON.stringify(highscore_arr);

        $('#highscore_input').hide();
        $('#title').html('Thanks for playing! :-)');
    }
    else {
        $('#title').html('Enter a name!');
    }

}
