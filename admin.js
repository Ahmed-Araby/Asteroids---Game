class admin
{
    constructor(level)
    { 
        this.level = level;
        
        // supposed to read the specification from a file
        this.speedX = 100;
        this.speedY = 100;
        this.rotationSpeed = 50;
        this.numberOfRocks = 12;
        
        this.rocks = new doublyLinkedList();
        
        this.rockLineWidth = '4'; // suposed to be determined from the level !!!
        this.playerSpaceShip = new spaceShip(can.width/2, can.height/2, 100,100, 50, 100, 100,90, 'red');
        
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
            centerY = Math.random() * can.height;
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
            centerX = Math.random() * can.width;
        }
        
        var numberOfVertices = Math.max(4, Math.random()*10);
        
        var rockObj = new rock(centerX , centerY, this.speedX, this.speedY, 50, 200, angle, numberOfVertices, '4', 'green');
        
        return rockObj;

    }
    
    spwan_rocks()
    {
        var curLength = this.rocks.length();
        console.log(curLength);
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
    
        this.spwan_rocks();
        
        for(var itr = this.rocks.begin(); itr!=this.rocks.end(); itr=itr.next){
            itr.val.update();
            itr.val.render();
            
            // check for delation ????
        }
        
        this.playerSpaceShip.update();
        this.playerSpaceShip.render();
        
        /*
        collesion detection
        laser bullets inside the space ship 
        will cauze us an issue 
        */
    }
}