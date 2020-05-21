const FPS = 30;

var can = document.getElementById('can');
var cntx = can.getContext('2d');

class shape
{
    constructor(centerX, centerY, speedX = 100 , speedY = 100, circleDiameter = 100, angle = 90, color = 'red')
    {
        // center 
        this.centerX = centerX;
        this.centerY = centerY;
        
        this.speedX = speedX;
        this.speedY = speedY;
        
        this.circleDiameter = circleDiameter;
        this._angle = angle;
        
        this.color = color; 
    }
     
    get angle()
    {
        return this._angle;
    }
    
    set angle(angleInDegree)
    {
        angleInDegree = this.fix_angle(angleInDegree);
        this._angle = angleInDegree;
    }
    
    fix_angle(angleInDegree)
    {
        if(angleInDegree<0)
            angleInDegree +=360;
        else if(angleInDegree>360)
            angleInDegree -=360;
        return angleInDegree;
        
    }
    
    degree_to_radian(angleInDegree)
    {
        angleInDegree = this.fix_angle(angleInDegree);
        return angleInDegree / 180 * Math.PI;
    }
    
    connect_vertices(verticesX, verticesY, lineWidth = '2', color='red')
    {
        cntx.beginPath();
        cntx.lineWidth = lineWidth;
        cntx.strokeStyle = color;
        
        var xs = verticesX[0];
        var ys = verticesY[0];
        
        for(var index = 1; index<verticesX.length; index+=1)
        {
            var xe = verticesX[index];
            var ye = verticesY[index];
            
            cntx.moveTo(xs, ys);
            cntx.lineTo(xe, ye);
            cntx.stroke();
            xs = xe;
            ys = ye;
        }
        
        if(verticesX.length > 2){
            cntx.moveTo(xs, ys);
            cntx.lineTo(verticesX[0], verticesY[0]);
            cntx.stroke();
        }
        cntx.closePath();
    }
}



class spaceShip extends shape
{
    constructor(centerX, centerY, speedX=100, speedY=100, rotationSpeed=50, circleDiameter = 100, laserRange = 100, angle = 90, color='red')
    {
        /*
        
        speed is in pixel per second
        radius for the virtual vircle that seround the triangle
        
        1 rotate left,
        0 no rotation,
        -1 rotate right
            
        -1 move up 
        1 move down
        
        */
        
        super(centerX, centerY, speedX, speedY, circleDiameter, angle, color);   
        
        this.rotationSpeed = rotationSpeed;
        this.laserRange = laserRange;
        
        this.rotate = 0;   
        this.move = 0;
        
        this.bullets = new doublyLinkedList();
    }
    
    update()
    {
        // update the state of the space ship
        // rotate the ship 
        this.angle = this.angle + this.rotate * this.rotationSpeed / FPS;
        
        // move the center of the ship respect to the ship orientation
        var angleInRadian = this.degree_to_radian(this.angle);
        
        // move in the x direction 
        this.centerX -= this.move * (this.speedX * Math.cos(angleInRadian) / FPS);
        // move in the reverse of Y direction 
        this.centerY += this.move * (this.speedY * Math.sin(angleInRadian) / FPS);
        
        // update the state laser bullets 
        for(var itr = this.bullets.begin(); itr!=this.bullets.end();){
            itr.val.update();
            if(itr.val.amIOut(can.width, can.height)==true)
            {
                var tmpItr = itr.next;
                this.bullets.deleteNode(itr);
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
        
        // render the space ship
        // get the front tip of the astroide
        var radius = this.circleDiameter / 2;
        var angleInRadian = this.degree_to_radian(this.angle);
        
        var xFront = this.centerX + radius  * Math.cos(angleInRadian);
        var yFront = this.centerY - radius  * Math.sin(angleInRadian);
        
        // get the lower left tip of the astroide
        var xLowerLeft = this.centerX - radius * (Math.cos(angleInRadian) + Math.sin(angleInRadian));
        var yLowerLeft = this.centerY + radius * (Math.sin(angleInRadian) - Math.cos(angleInRadian));
        
        // get the lower right tip of the astroide 
        var xLowerRight = this.centerX - radius * (Math.cos(angleInRadian) - Math.sin(angleInRadian));
        var yLowerRight = this.centerY + radius * (Math.sin(angleInRadian) + Math.cos(angleInRadian));
        
        // draw the ship
        var verticesX = [xFront, xLowerLeft, xLowerRight];
        var verticesY = [yFront, yLowerLeft, yLowerRight];
        
        //console.log(verticesY);
        this.connect_vertices(verticesX, verticesY, '2', this.color);
        
        
        // render the laser bullets 
        for( var itr = this.bullets.begin(); itr!=this.bullets.end(); itr = itr.next)
            itr.val.render();
    }
    
    shootLaser()
    {
        /*
        we can view centerX and centerY addition as translation 
        and the rest of the equation is spliting the vecetor in a specific direction 
        into two vectors one in X direction and 1 in y direction
        */
        
        // get the front tip of the astroide with some margine
        var radius = this.circleDiameter / 2;
        var angleInRadian = this.degree_to_radian(this.angle);
        var margin = 5;
        
        var lineCenterX = this.centerX + (radius + margin + this.laserRange / 2)* Math.cos(angleInRadian);
        var lineCenterY = this.centerY - (radius + margin + this.laserRange / 2)* Math.sin(angleInRadian);
        
        var laserBullet = new laser(lineCenterX, lineCenterY, 100, 100, this.laserRange, this.angle, '3', 'blue');
        this.bullets.push(laserBullet);
    }
}


class rock extends shape
{
    constructor(centerX, centerY, speedX=100, speedY=100, rotationSpeed=50, circleDiameter = 100, angle = 90, numberOfVertices = 4, lineWidth = '4', color='red')
    {
        super(centerX, centerY, speedX, speedY, circleDiameter, angle, color); 
        
        this.distance = [];
        this.partialRotationAngle = 360 / numberOfVertices;
        this.numberOfVertices = numberOfVertices;
        this.lineWidth = lineWidth;
        
        /*
            build the distance for the vertices that define the rock shape
        */
        
        for(var index = 0; index<this.numberOfVertices; index+=1)
        {
            var dist = parseInt(Math.random() * this.circleDiameter / 2);
            this.distance.push(dist);
        }
    }
    
    
    update()
    {
        var angleInRadian = this.degree_to_radian(this.angle);
        this.centerX = this.centerX + Math.cos(angleInRadian) * this.speedX / FPS;
        this.centerY = this.centerY - Math.sin(angleInRadian) * this.speedY / FPS;
    }
    
    render()
    {
        
        var tmpAngle = this.angle;
        var verticesX = [];
        var verticesY = [];
        
        for(var index=0; index<this.numberOfVertices; index+=1)
        {
            var angleIndegree = this.degree_to_radian(tmpAngle);
            var dist = this.distance[index];
            var tmpX = this.centerX + Math.cos(angleIndegree) * dist; 
            var tmpY = this.centerY - Math.sin(angleIndegree) * dist;
            verticesX.push(tmpX);
            verticesY.push(tmpY);
            tmpAngle +=this.partialRotationAngle;
            tmpAngle = this.fix_angle(tmpAngle);
        }
        
        this.connect_vertices(verticesX, verticesY, this.lineWidth, this.color);
    }
    
}

class laser extends shape
{
    constructor(centerX, centerY, speedX=100, speedY=100, circleDiameter = 100, angle = 90, lineWidth = '4', color='red')
    {
        // circle diameter is the length of the line 
        super(centerX, centerY, speedX, speedY, circleDiameter, angle, color);
        
        this.lineWidth = lineWidth;
    }
    
    update()
    {
        var angleInRadian = this.degree_to_radian(this.angle);
        this.centerX += Math.cos(angleInRadian) * this.speedX / FPS;
        this.centerY -= Math.sin(angleInRadian) * this.speedY / FPS;
    }
    
    get_front_point()
    {
        var angleInRadian = this.degree_to_radian(this.angle);
        var radius = this.circleDiameter / 2;
        
        // get front x and y 
        var frontX = this.centerX + Math.cos(angleInRadian) * radius;
        var frontY = this.centerY - Math.sin(angleInRadian) * radius;
        
        return  [frontX, frontY];
    }
    
    get_back_point()
    {
        var angleInRadian = this.degree_to_radian(this.angle);
        var radius = this.circleDiameter / 2;
        
        var backX = this.centerX - Math.cos(angleInRadian) * (radius);
        var backY = this.centerY + Math.sin(angleInRadian) * (radius);
        
        return [backX, backY];
    }
    
    render()
    {

        
        // get front x and y
        var frontPoint = this.get_front_point(); 
        var frontX = frontPoint[0];
        var frontY = frontPoint[1];
        // get back x and y 
        var backPoint = this.get_back_point();
        var backX = backPoint[0];
        var backY = backPoint[1];
        
        var verticesX = [backX, frontX];
        var verticesY = [backY, frontY];
        
        this.connect_vertices(verticesX, verticesY, this.lineWidth, this.color);
    }
    
    amIOut(canWidth, canHeight)
    {
        var backPoint = this.get_back_point();
        var backX = backPoint[0];
        var backY = backPoint[1];
        if(backX < 0 || backX >=canWidth || backY <0 || backY >=canHeight)
            return true;
        return false;
    }
}