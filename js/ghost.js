// -- declaration for ghost

function Ghost(name, img, gridBaseX, gridBaseY) {
// TODO

    this.gridBaseX = gridBaseX;
    this.gridBaseY = gridBaseY;
    this.startPosX = gridBaseX * CELL_SIZE;
    this.startPosY = gridBaseY * CELL_SIZE;
    this.dirX = 0;
    this.dirY = 0;

    this.chaseCounter = 0;
    this.posX = this.startPosX;
    this.posY = this.startPosY;

    this.radius = 14;
    this.name = name;
    this.img = new Image();
    this.img.width = 28;
    this.img.height = 28;
    this.img.src = img;
    this.dead = false;
    this.direction = undefined;
    this.lastPosX = this.posX;
    this.lastPosY = this.posY;

    this.chaseMode = false;
    this.dazzling = false;
    this.dir = undefined;



    this.getPosX = function () {
        return Math.floor((this.posX)/ CELL_SIZE);


    };
    this.getPosY = function () {
        return Math.floor((this.posY)/ CELL_SIZE);
    };
    this.getLastPosX = function() {
        return Math.floor((this.lastPosX)/ CELL_SIZE);


    };
    this.getLastPosY = function() {
        return Math.floor((this.lastPosY)/ CELL_SIZE);

    };
    //level.cellData[this.getPosX()][this.getPosY()] = 0;



    this.setDirection = function(dir)
    {
        this.direction = dir;
        this.dirX = dir.dirX;
        this.dirY = dir.dirY;
    };
    /*this.checkDirection = function ()
    {
        var dX = this.getPosX();
        var dY = this.getPosY();


        if(!this.dead) {
            lastPosX = this.posX;
            lastPosY = this.posY;
            switch (this.direction) {
                case left:
                    if (level.cellData[dX - 1][dY] == 1) {
                        checkCollision();
                        this.move();
                    }
                    else {
                        this.setDirection(right);
                    }

                    break;
                case right:
                    if (level.cellData[dX + 1][dY] == 1) {
                        checkCollision();
                        this.move();
                    }
                    else {
                       this.setDirection(left);
                    }

                    break;
                case up:
                    if (level.cellData[dX][dY - 1] == 1) {
                        checkCollision();
                        this.move();
                    }
                    else {
                        this.setDirection(down);
                    }

                    break;
                case down:
                    if (level.cellData[dX][dY + 1] == 1) {
                        checkCollision();
                        this.move();
                    }
                    else {
                        this.setDirection(up);
                    }

                    break;

            }
        }
    };*/
    this.getOppositeDirection = function () {
        switch(this.dir)
        {
            case left:
                return right;
            case right:
                return left;
            case down:
                return up;
            case up:
                return down;
        }
    };

    this.move = function () {
        checkCollision();

        if(this.posX % CELL_SIZE == 0 && this.posY % CELL_SIZE == 0) {
            this.setDirection(this.getNextDirection());
        }

        console.log("last: " + this.getLastPosX(), this.getLastPosY());


        this.posX += this.dirX * CELL_SIZE/4;
        this.posY += this.dirY * CELL_SIZE/4;

        if(this.getLastPosX() != this.getPosX() || this.getLastPosY() != this.getPosY()) {
            if (level.dots[this.getLastPosX()][this.getLastPosY()] != undefined) {
                $(level.dots[this.getLastPosX()][this.getLastPosY()].domElement).show();

            }
        }

        this.lastPosX = this.posX;
        this.lastPosY = this.posY;

        if(this.getPosX() == pacman.getPosX() || this.getPosY() == pacman.getPosY())
        {
            if(this.chaseCounter >= 3)
            {
                this.chaseMode = false;
                this.chaseCounter--;

            }
            else if(this.chaseCounter < 3)
            {
                this.chaseMode = true;
                this.chaseCounter++;
            }
            //this.chaseMode = true;

        }
        else
        {
            this.chaseMode = false;
            this.chaseCounter = 0;
        }

    };
    this.renderContent = function () {
        //draw whole canvas new
        if(level.dots[this.getPosX()][this.getPosY()] != undefined) {
            $(level.dots[this.getPosX()][this.getPosY()].domElement).hide();
            //level.cellData[this.getPosX()][this.getPosY()] = 0;
        }

        renderingContext.drawImage(this.img, this.posX, this.posY, 28, 28);
    };

    /* Pathfinding */
    this.getNextDirection = function () {
        // get next field
        var pX = this.getPosX();
        var pY = this.getPosY();
        var tX, tY;


        // get target
        if (this.dead) {			// go Home
            tX = this.gridBaseX;
            tY = this.gridBaseY;
        }

        else
        {
            if(this.chaseMode == true)
            {
                tX = pacman.getPosX();
                tY = pacman.getPosY();
            }
            else {

                switch (this.name) {

                    // target: 4x4 away of pacman
                    case "pinky":
                        var pdir = pacman.direction;
                        var pdirX = pdir.dirX == 0 ? -pdir.dirY : pdir.dirX;
                        var pdirY = pdir.dirY == 0 ? -pdir.dirX : pdir.dirY;

                        tX = (pacman.getPosX() + pdirX * 4) % (SCREEN_WIDTH / pacman.radius + 1);
                        tY = (pacman.getPosY() + pdirY * 4) % (SCREEN_HEIGHT / pacman.radius + 1);
                        break;

                    // target: pacman
                    case "blinky":
                        tX = pacman.getPosX();
                        tY = pacman.getPosY();
                        break;

                    // target:
                    case "inky":
                        tX = pacman.getPosX() + 2 * pacman.direction.dirX;
                        tY = pacman.getPosY() + 2 * pacman.direction.dirY;
                        var vX = tX - blinky.getPosX();
                        var vY = tY - blinky.getPosY();
                        tX = Math.abs(blinky.getPosX() + vX * 2);
                        tY = Math.abs(blinky.getPosY() + vY * 2);
                        break;

                    // target: pacman, until pacman is closer than 5 grid fields, then back to scatter
                    case "clyde":
                        tX = pacman.getPosX();
                        tY = pacman.getPosY();
                        var dist = Math.sqrt(Math.pow((pX - tX), 2) + Math.pow((pY - tY), 2));

                        if (dist < 5) {
                            tX = this.gridBaseX;
                            tY = this.gridBaseY; //go home
                        }
                        break;

                }
            }

            var oppDir = this.getOppositeDirection();	// ghosts are not allowed to change direction 180 deg

            var dirs = [{}, {}, {}, {}];
            var x = this.getPosX();
            var y = this.getPosY();
            console.log(x, y);
            dirs[0].field = level.cellData[x][y - 1];
            dirs[0].dir = up;
            dirs[0].distance = Math.sqrt(Math.pow((x - tX), 2) + Math.pow((y - 1 - tY), 2));

            dirs[1].field = level.cellData[x][y + 1];
            dirs[1].dir = down;
            dirs[1].distance = Math.sqrt(Math.pow((x - tX), 2) + Math.pow((y + 1 - tY), 2));

            dirs[2].field = level.cellData[x + 1][y];
            dirs[2].dir = right;
            dirs[2].distance = Math.sqrt(Math.pow((x + 1 - tX), 2) + Math.pow((y - tY), 2));

            dirs[3].field = level.cellData[x - 1][y];
            dirs[3].dir = left;
            dirs[3].distance = Math.sqrt(Math.pow((x - 1 - tX), 2) + Math.pow((y - tY), 2));

            // Sort possible directions by distance
            function compare(a, b) {
                if (a.distance < b.distance)
                    return -1;
                if (a.distance > b.distance)
                    return 1;
                return 0;
            }

            var dirs2 = dirs.sort(compare);
            var r = none;
            console.log(dirs2);

            for (var i = dirs2.length - 1; i >= 0; i--) {
                if ((dirs2[i].field != 0) && (dirs2[i].dir != oppDir)) {
                    r = dirs2[i].dir;
                }
                console.log(dirs2[i].dir, dirs2[i].field);
            }

            return r;

        }


    };
    this.setRandomDirection = function() {
        var dir = Math.floor((Math.random()*10)+1)%5;

        switch(dir) {
            case 1:
                if (this.getOppositeDirection().equals(up)) this.setDirection(down);
                else this.setDirection(up);
                break;
            case 2:
                if (this.getOppositeDirection().equals(down)) this.setDirection(up);
                else this.setDirection(down);
                break;
            case 3:
                if (this.getOppositeDirection().equals(right)) this.setDirection(left);
                else this.setDirection(right);
                break;
            case 4:
                if (this.getOppositeDirection().equals(left)) this.setDirection(right);
                else this.setDirection(left);
                break;
        }
    };
    this.reset = function()
    {
        this.posX = this.gridBaseX * CELL_SIZE;
        this.posY = this.gridBaseY * CELL_SIZE;
    }
}
