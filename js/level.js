/**
 * Created by Andreas on 23.01.2016.
 */
function Level(img, c) {
    var context = c;
    this.totalDots = 0;

    // create a greenscreen behind level so
    // we can detect what is a wall etc
    context.fillStyle = "#00FF00";
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    context.drawImage(img, 0, 0);

    var w;
    var yp;
    var xp = yp = CELL_SIZE / 2;
    var h;
    var dot;
    var cellData = this.cellData = [];
    var dots = this.dots = [];


    for(w = 0; w < GRID_WIDTH; w++)
    {
        cellData[w] = [];
        yp = CELL_SIZE/2;
        dots[w] = [];
        for(h = 0; h < GRID_HEIGHT; h++)
        {
            var imageData = context.getImageData(xp - CELL_SIZE/2, yp - CELL_SIZE/2, CELL_SIZE, CELL_SIZE); //getImageData gets RGBA values stored in data.
            cellData[w][h] = 1; //default
            for(var i = 1; i < imageData.data.length; i = i + 4)
            {
                //process image data, check if color is green, when not there is a wall!
                if(imageData.data[i] != 255)
                {
                    cellData[w][h] = 0;
                    break;
                }
            }
            yp += CELL_SIZE;
        }
        xp += CELL_SIZE;
    }
    // revert the bg to black
    context.fillStyle = "#000";
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    context.drawImage(img, 0, 0);

    this.createDots = function()
    {
        xp = yp = CELL_SIZE / 2;
        for(w = 0; w < GRID_WIDTH; w++)
        {
            yp = CELL_SIZE/2;
            for (h = 0; h < GRID_HEIGHT; h++) {
                if (cellData[w][h] == 1) {
                    //add dot to eat
                    dot = new Dot(xp, yp, 5);
                    gamecontainer.appendChild(dot.domElement);
                    dots[w][h] = dot;
                    this.totalDots++;
                }
                yp += CELL_SIZE;
            }
            xp += CELL_SIZE;
        }

    };


    this.reset = function()
    {
        var w = dots.length;
        while(w-- > -1)
        {
            var h = dots[w].length;
            while(h-- > -1)
            {
                if(dots[w][h] != null && dots[w][h].eaten)
                {
                    dots[w][h].reset();
                    cellData[w][h] = 1;
                }
            }
        }
    };
}