class admin
{
    constructor(level)
    { 
        this.level = level;
        
        // supposed to read the specification from a file
        this.speedX = 20;
        this.speedY = 20;
        this.rotationSpeed = 0;
        this.numberOfRocks = 5;
        this.rockCircleDiameter = 200;
        this.rocks = new doublyLinkedList();
        
        this.rockLineWidth = '4'; // suposed to be determined from the level !!!
        this.playerSpaceShip = new spaceShip(can.width/2, can.height/2, 300,300, 200, 100, 100,90, 'red');
        this.collisionDetector = new collisionDetection();
        // add event listners 
        document.addEventListener('keydown', this.keydown.bind(this));
        document.addEventListener('keyup', this.keyup.bind(this));
    }
    
    keydown(ev)
    {
        /*
        this here refer to the document object
        this is relative to what ever is calling the function 
        so in this case addEventListner internals call Keydown function 
        so it have this refer to document 
        */
        
        console.log("key down")
        switch(ev.keyCode)
        {
            case 39: // right 
                this.playerSpaceShip.rotate = -1;
                break;
            case 37:  // left
                this.playerSpaceShip.rotate = 1;
                break;
            case 38:  // up
                this.playerSpaceShip.move = -1;
                break;
            case 40: // down
                this.playerSpaceShip.move = 1;
                break;
            case 32: // space 
                this.playerSpaceShip.shootLaser();
        }
    }


    keyup(ev)
    {
        console.log("key up");
        switch(ev.keyCode)
        {
            case 39:
                this.playerSpaceShip.rotate = 0;
                break;
            case 37:
                this.playerSpaceShip.rotate = 0;
                break;
            case 38:
                this.playerSpaceShip.move = 0;
                break;
            case 40:
                this.playerSpaceShip.move = 0;
        }
    }
    
    build_aRock()
    {
        // get the rock center coordinates 
        var sideRand = Math.random();
        var rand = Math.random();
        
        var centerX = -1;
        var centerY = -1;
        var angle = 0;
        
        if(sideRand < 0.5) // horizontal 
        {
            if(sideRand<0.25){ // left 
                centerX = 0;
                angle = -45 + Math.random() * 90; // will be fixed 
            }
            else{ // right
                console.log("right here")
                centerX = can.width - 1;
                angle = 135 + Math.random() * 90;
            }
            
            // row 
            var cnt = 0;
            while(true)
            {
                var out = true;
                centerY = Math.random() * can.height;
                for(var itr = this.rocks.begin();  itr!=this.rocks.end(); itr = itr.next){
                    var dis = this.distance_between_2points(centerY, itr.val.centerY);
                    if(dis < this.rockCircleDiameter /2){
                        out=false;
                        break;
                    }
                }
                
                cnt +=1;
                //console.log("Y", this.rocks.length(), dis, this.rockCircleDiameter / 2, out)
                //break;
                if(out == true || this.rocks.length() ==0 || cnt >=20)
                    break;
            }
        }
        
        else // vertical 
        {
            if(sideRand <0.75){ // up 
                centerY = 0;
                angle = 225 + Math.random() * 90;
            }
            else{ // down 
                centerY = can.height - 1;
                angle = 45 + Math.random() * 90
            }
            
            // col 
            var cnt = 0;
            while(true)
            {
                var out = true;
                centerX = Math.random() * can.width;
                for(var itr = this.rocks.begin();  itr!=this.rocks.end(); itr = itr.next){
                    var dis = this.distance_between_2points(centerX, itr.val.centerX);
                    
                    if(dis < this.rockCircleDiameter /2){
                        out=false;
                        break;
                    }
                }
                
                cnt +=1;
                //console.log("Y", this.rocks.length(), dis, this.rockCircleDiameter / 2, out)
                //break;
                if(out == true || this.rocks.length() ==0 || cnt >=20)
                    break;
            }
        }
        
        var numberOfVertices = Math.floor(Math.max(4, Math.random()*10));
        
        var rockObj = new rock(centerX , centerY, this.speedX, this.speedY, this.rotationSpeed, this.rockCircleDiameter, angle, numberOfVertices, this.rockLineWidth, 'green');
        
        return rockObj;

    }
    
    spwan_rocks()
    {
        var curLength = this.rocks.length();
        //console.log(curLength);
        for(var index = curLength; index<this.numberOfRocks; index+=1)
        {
            var rockObj = this.build_aRock();
            this.rocks.push(rockObj);
        }
    }
    
    game_loop()
    {
        //console.log(this)
        // clear the screen 
        // clear the screen 
        cntx.fillStyle = 'black';
        cntx.fillRect(0 , 0, can.width, can.height);
    
        //  build rocks 
        this.spwan_rocks();
        
        // update , render for rocks 
        for(var itr = this.rocks.begin(); itr!=this.rocks.end(); itr=itr.next){
            itr.val.update();
            itr.val.render();
            
            // check for delation ????
        }
        
        // update , render the space ship 
        this.playerSpaceShip.update();
        this.playerSpaceShip.render();
        
        /*
        collesion detection
        laser bullets inside the space ship 
        will cauze us an issue 
        
        [ISSUE] we need to partion the non convex polygon into convex
        small polygons = triangles 
        as the sat algo work for convex polygons 
        */
        
        // ship and rocks
        var shipPoly = this.playerSpaceShip.build_polygon();
        for(var itr = this.rocks.begin(); itr!=this.rocks.end(); itr = itr = itr.next){
            var rockpoly = itr.val.build_polygon();
            var res = this.collisionDetector.detect_collision(shipPoly, rockpoly, 'SAT');
            
            console.log(rockpoly.edges[0])
            if(res==true)
              itr.val.color = 'red';
            else 
                itr.val.color = 'white';
        }
    }
    
    distance_between_2points(a, b){
        return Math.sqrt((a-b) * (a-b));
    }
}