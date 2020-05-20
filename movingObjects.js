class movingObject
{
    constructor(angle, speed)
    {
        /*
        angle is the  direction that the object move in it 
        */
        this.angle = angle;
        this.speed = speed;
    }
    
    degree_to_radian(angle_in_degree)
    {
        if(angle_in_degree<0)
            angle_in_degree +=360;
        else if(angle_in_degree>360)
            angle_in_degree -=360;
        
        return angle_in_degree / 180 * Math.PI;
    }
}

class laser extends movingObject
{
    
    constructor(angle, speed, xs, ys, xe, ye, color)
    {
        super(angle, speed);
        this.xs = xs;
        this.ys = ys;
        
        this.xe = xe;
        this.ye = ye;
        
        this.color = color;
    }
    
    render(color='green')
    {
        //console.log(this.xs, this.ys, this.xe, this.ye);
        cntx.beginPath();
        cntx.lineWidth = '4';
        cntx.strokeStyle = color;
        
        cntx.moveTo(this.xs, this.ys);
        cntx.lineTo(this.xe, this.ye);
        cntx.closePath();
        cntx.stroke();
    }
    
    move()
    {
        /*
            split the movement into
            x direction and y direction
        */
        
        // delete current line 
        this.render('black');
        
        var angel_in_radian = this.degree_to_radian(this.angle)
        //console.log("here", this.speed * Math.cos(angel_in_radian) / FPS)
        
        this.xs = this.xs + this.speed * Math.cos(angel_in_radian) / FPS
        this.ys = this.ys - this.speed * Math.sin(angel_in_radian) / FPS
        this.xe = this.xe + this.speed * Math.cos(angel_in_radian) / FPS
        this.ye = this.ye - this.speed * Math.sin(angel_in_radian) / FPS
    }
    
    amIOut(canWidth, canHeight)
    {
        if(this.xs < 0 || this.xs >=canWidth || this.ys <0 || this.ye >=canHeight)
            return true;
        return false;
    }
}