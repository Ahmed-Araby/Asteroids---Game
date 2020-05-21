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
        this.playerSpaceShip = null;
    }
    
    spwanRock()
    {
        
    }
}