function Direction(name,angle1,angle2,dirX,dirY) {
    this.name = name;
    this.angle1 = angle1;
    this.angle2 = angle2;
    this.dirX = dirX;
    this.dirY = dirY;
    this.equals = function(dir) {
        return  JSON.stringify(this) ==  JSON.stringify(dir);
    };
}
