const FPS = 30;

var can = document.getElementById('can');
var cntx = can.getContext('2d');

class shape
{
    constructor(x, y, angle, color = 'red')
    {
        // center 
        this.x = x;
        this.y = y;
        
        this._angle = angle;
        this._color = color; 
    }
     
    get angle()
    {
        return this._angle;
    }
    
    set angle(angle_in_degree)
    {
        if(angle_in_degree<0)
            angle_in_degree +=360;
        else if(angle_in_degree>360)
            angle_in_degree -=360;
        
        this._angle = angle_in_degree;
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



class astroid extends shape
{
    constructor(x, y, xSpeed, ySpeed, rotationSpeed, angle, color, size, laserRange)
    {
        super(x, y, angle, color);
        this._size = size;
        
        /*
            radius for the virtual vircle that seround the triangle 
        */
        
        this._r = size / 2; 
        this._laserRange = laserRange;
        
        // speed is in pixel per second
        this._xSpeed = xSpeed;
        this._ySpeed = ySpeed;
        this._rotationSpeed = rotationSpeed;
        
        /*
            1 rotate left,
            0 no rotation,
            -1 rotate right
            
            -1 move up 
            1 move down 
        */
        
        this.rotate = 0;   
        this.move = 0;
        
        this.bullets = new doublyLinkedList();
       
    }
    
    
    drawLine(cntx, xs, ys, xe, ye, color = "red")
    {
        cntx.beginPath();
        cntx.lineWidth = '2';
        cntx.strokeStyle = color;
        
        cntx.moveTo(xs, ys);
        cntx.lineTo(xe, ye);
        cntx.closePath();
        cntx.stroke();
    }
    
    update()
    {
        // rotate the ship 
        this.angle = this.angle + this.rotate * this._rotationSpeed / FPS;
        
        // move the center of the ship
        /*
        the ship need to move in the direction of the nose 
        */
        
        var angleInRadian = this.degree_to_radian(this.angle);
        // move in the x direction 
        this.x -= this.move * (this._xSpeed * Math.cos(angleInRadian) / FPS);
        // move in the reverse of Y direction 
        this.y += this.move * (this._ySpeed * Math.sin(angleInRadian) / FPS);
        
        console.log("bullet number", this.bullets.length());
        for( var itr = this.bullets.begin(); itr!=this.bullets.end();){
            itr.val.move();
            
            // delete the bullet
            console.log("res", itr.val.amIOut(can.width, can.height))
            if(itr.val.amIOut(can.width, can.height)==true)
            {
                var tmpItr = itr.next;
                this.bullets.deleteNode(itr); // COMPARE BY reference 
                itr = tmpItr;
                continue; 
            }
            itr = itr.next
        }
    }
    
    render()
    {
        
        /*
        I don't understand this trignometry !!!!
        */
        
        // get the front tip of the astroide
        var angle_in_radian = this.degree_to_radian(this._angle);
        var xf = this.x + this._r  * Math.cos(angle_in_radian);
        var yf = this.y - this._r  * Math.sin(angle_in_radian);
        
        // get the lower left tip of the astroide
        var xll = this.x - this._r * (Math.cos(angle_in_radian) + Math.sin(angle_in_radian));
        var yll = this.y + this._r * (Math.sin(angle_in_radian) - Math.cos(angle_in_radian));
        
        // get the lower right tip of the astroide 
        var xlr = this.x - this._r * (Math.cos(angle_in_radian) - Math.sin(angle_in_radian));
        var ylr = this.y + this._r * (Math.sin(angle_in_radian) + Math.cos(angle_in_radian));
        
        // draw the ship
        this.drawLine(cntx, xf, yf, xlr, ylr, this._color);
        this.drawLine(cntx, xf, yf, xll, yll, this._color);
        this.drawLine(cntx, xll, yll, xlr, ylr, this._color);
        
        // move the laser bullets and render them 
        //console.log(typeof this.bullets[0], this.bullets.length);
        
        /*for(var index = 0; index<this.bullets.length; index+=1)
            this.bullets[index].render();*/
        for( var itr = this.bullets.begin(); itr!=this.bullets.end(); itr = itr.next)
            itr.val.render();
    }
    
    shootLaser()
    {
        /*
        will been called in respnse to the space click 
        event 
        */
        
        // get the front tip of the astroide with some margine
        var angle_in_radian = this.degree_to_radian(this._angle);
        var xs = this.x + (this._r + 5) * Math.cos(angle_in_radian);
        var ys = this.y - (this._r + 5) * Math.sin(angle_in_radian);
        
        // get the end point of the laser range 
        var xe = this.x + (this._r + this._laserRange) * Math.cos(angle_in_radian);
        var ye = this.y -(this._r + this._laserRange) * 
        Math.sin(angle_in_radian);
        
        //this.drawLine(cntx, xf, yf, xe, ye);
        var laserObject = new laser(this.angle, 200, xs, ys, xe, ye, 'green');
        laserObject.render();
        this.bullets.push(laserObject);
    }
}


class rock extends shape
{
    constructor(x, y, angle, color)
    {
        super(x, y, angle, color);
        
        /*
        determine the direction to move in and the speed
        */
    }
    
    render()
    {
        // geometric logic to render the rock 
    }
    
    move()
    {
        
    }
}