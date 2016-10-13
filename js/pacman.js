/**
 * Created by Andreas on 23.01.2016.
 */
function Pacman(level) {
// -- pacman
    //start value of pacman

    this.posX = 0;
    this.posY = 0;
    this.eyePosX = 0;
    this.eyePosY = 0;
    this.dirX = 0;
    this.dirY = 0;
    this.radius = 14;
    this.eyeRadius = 2;
    this.startAngle = 0.25;
    this.endAngle = 1.75;
    this.gapClosing = true;
    this.level = level;
    this.direction = none;
    this.dead = false;
    this.lives = 10;
    this.pause = false;

    this.totalEatenDots = 0;

    var lastPosX, lastPosY;

    //live bar
    var livebar = document.querySelector('#lives');



    for(var i = 0; i < this.lives; i++)
    {
        var live = document.createElement('img');
        live.src = "img/heart.png";
        livebar.appendChild(live);
    }

    this.getPosX = function()
    {
        switch(this.direction){
            case left:
                return Math.floor((this.posX + this.radius)/ CELL_SIZE);
                break;
            case right:
                return Math.floor((this.posX - this.radius)/ CELL_SIZE);
                break;
            default:
                return Math.floor((this.posX)/ CELL_SIZE);
                break;
        }

    };
    this.getPosY = function()
    {
        switch(this.direction){
            case up:
                return Math.floor((this.posY + this.radius)/ CELL_SIZE);
                break;
            case down:
                return Math.floor((this.posY - this.radius)/ CELL_SIZE);
                break;
            default:
                return Math.floor((this.posY)/ CELL_SIZE);
                break;
        }

    };
    this.setDirection = function(dir)
    {

        this.direction = dir;
        this.dirX = dir.dirX;
        this.dirY = dir.dirY;
    };
    this.move = function()
    {
        this.posX += this.dirX * CELL_SIZE;
        this.posY += this.dirY * CELL_SIZE;


        if(this.dirX == 0 && this.dirY == 0) //pacman stops
            pacmanWaka.pause();
        else if(pacmanWaka.paused)
            pacmanWaka.play();

        this.lastPosX = this.posX;
        this.lastPosY = this.posY;


    };
    this.setAngles = function()
    {
        var angle1MIN, angle1MAX;
        if(!this.dead)
        {

            if (this.direction == right || this.direction == none) {
                angle1MIN = 0;
                angle1MAX = right.angle1;
            }
            if (this.direction == left) {
                angle1MIN = 1;
                angle1MAX = left.angle1;
            }
            if (this.direction == up) {
                angle1MIN = 1.5;
                angle1MAX = up.angle1;
            }
            if (this.direction == down) {
                angle1MIN = 0.5;
                angle1MAX = down.angle1;
            }


            if (this.startAngle - 0.05 <= angle1MIN) this.gapClosing = true;
            else if (this.startAngle >= angle1MAX) this.gapClosing = false;

            if (this.gapClosing) {
                this.startAngle = this.startAngle + 0.05;
                this.endAngle = this.endAngle - 0.05;
            }
            else {
                this.startAngle = this.startAngle - 0.05;
                this.endAngle = this.endAngle + 0.05;
            }
        }
        else {
            //animate death
            if (this.direction == right)
            {
                if (this.startAngle+0.05 <= 1 && this.endAngle-0.05 >= 1)
                {
                    this.startAngle += 0.05;
                    this.endAngle -= 0.05;
                }
                else
                {
                    this.posX = CELL_SIZE + this.radius;
                    this.posY = CELL_SIZE + this.radius;
                    this.dead = false;
                    this.direction = none;
                    this.startAngle = none.angle1;
                    this.endAngle = none.angle2;
                    this.eyePosX = pacman.radius / 4;
                    this.eyePosY = -pacman.radius / 1.7;
                }
            }
            if(this.direction == left)
            {
                if (this.startAngle+0.05 <= 2 && this.endAngle-0.05 >= 0)
                {
                    this.startAngle += 0.05;
                    this.endAngle -= 0.05;
                }
                else
                {
                    this.posX = CELL_SIZE + this.radius;
                    this.posY = CELL_SIZE + this.radius;
                    this.dead = false;
                    this.direction = none;
                    this.startAngle = none.angle1;
                    this.endAngle = none.angle2;
                    this.eyePosX = pacman.radius / 4;
                    this.eyePosY = -pacman.radius / 1.7;
                }
            }
            if(this.direction == up)
            {
                if (this.startAngle+0.05 <= 2.5 && this.endAngle-0.05 >= 0.5)
                {
                    this.startAngle += 0.05;
                    this.endAngle -= 0.05;
                }
                else
                {
                    this.posX = CELL_SIZE + this.radius;
                    this.posY = CELL_SIZE + this.radius;
                    this.dead = false;
                    this.direction = none;
                    this.startAngle = none.angle1;
                    this.endAngle = none.angle2;
                    this.eyePosX = pacman.radius / 4;
                    this.eyePosY = -pacman.radius / 1.7;
                }
            }
            if(this.direction == down)
            {
                if (this.startAngle+0.05 <= 1.5 && this.endAngle-0.05 >= -0.5)
                {
                    this.startAngle += 0.05;
                    this.endAngle -= 0.05;
                }
                else
                {
                    this.posX = CELL_SIZE + this.radius;
                    this.posY = CELL_SIZE + this.radius;
                    this.dead = false;
                    this.direction = none;
                    this.startAngle = none.angle1;
                    this.endAngle = none.angle2;
                    this.eyePosX = pacman.radius / 4;
                    this.eyePosY = -pacman.radius / 1.7;
                }
            }
        }



    };



    this.renderContent = function () {
        //draw whole canvas new
        renderingContext.fillStyle = "#000";
        renderingContext.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        renderingContext.drawImage(levelImage, 0, 0);

        renderingContext.save();
        renderingContext.beginPath();
        renderingContext.fillStyle = "Yellow";
        renderingContext.strokeStyle = "Yellow";
        renderingContext.arc(this.posX, this.posY, this.radius, this.startAngle* Math.PI, this.endAngle * Math.PI);
        renderingContext.lineTo(this.posX, this.posY);
        renderingContext.stroke();
        renderingContext.fill();
        renderingContext.closePath();

        renderingContext.save();
        renderingContext.beginPath();
        renderingContext.fillStyle = "Black";
        renderingContext.strokeStyle = "Black";
        renderingContext.arc(this.posX + this.eyePosX, this.posY + this.eyePosY, this.eyeRadius, 0, 2*Math.PI);
        renderingContext.stroke();
        renderingContext.fill();
        renderingContext.closePath();

        renderingContext.restore();

    };
    this.stop = function()
    {
        this.dirX = 0;
        this.dirY = 0;
        //this.direction = none;
        this.pause = true;
        pacmanWaka.pause();
        pacmanWaka.currentTime = 0;
    };
    this.die = function()
    {
        if(!this.dead) {
            this.dead = true;
            pacmanDies.play();

            this.lives--;
            var live = document.getElementById('lives').lastElementChild;
            $(live).remove();
        }
    };

    /*this.checkDirection = function ()
    {
        var dX = pacman.getPosX();
        var dY = pacman.getPosY();
        pacmanWaka.volume = 0.2;
        checkCollision();


        if(!this.dead) {
            lastPosX = this.posX;
            lastPosY = this.posY;
            switch (pacman.direction) {
                case left:
                    if (this.level.cellData[dX - 1][dY] == 1) {
                        pacmanWaka.play();
                        pacman.move();
                    }
                    else {
                        pacman.stop();
                    }

                    break;
                case right:
                    if (this.level.cellData[dX + 1][dY] == 1) {
                        pacmanWaka.play();
                        pacman.move();
                    }
                    else {
                        pacman.stop();
                    }

                    break;
                case up:
                    if (this.level.cellData[dX][dY - 1] == 1) {
                        pacmanWaka.play();
                        pacman.move();
                    }
                    else {
                        pacman.stop();
                    }

                    break;
                case down:
                    if (this.level.cellData[dX][dY + 1] == 1) {
                        pacmanWaka.play();
                        pacman.move();
                    }
                    else {
                        pacman.stop();
                    }

                    break;

            }
        }
    };*/



}