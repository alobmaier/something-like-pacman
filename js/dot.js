/**
 * Created by Andreas on 23.01.2016.
 */
function Dot(x, y, size)
{
    this.width = this.height = size;
    this.eaten = false;

    this.domElement = document.createElement('div');
    this.domElement.className = "dot";
    this.domElement.style.width = size + "px";
    this.domElement.style.height = size + "px";
    this.domElement.style.borderRadius = size + "px";
    this.domElement.style.left = Math.round(x-(size/2))+"px";
    this.domElement.style.top = Math.round(y-(size/2))+"px";

    this.eat = function()
    {
        if(this.eaten != true)
        {
            score += 10;
            console.log("score:" + score);
            document.getElementById('score').innerHTML = "Score: " + score;
            this.eaten = true;
            this.domElement.style.opacity = 0;
            pacman.totalEatenDots++;
        }
    };

    this.reset = function()
    {
        this.eaten = false;
        this.domElement.style.opacity = 1;
    };
}