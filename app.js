var can = document.getElementById('can');
var cntx = can.getContext('2d');
can.width = 800;
can.height = 800;

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

function keydown(ev)
{
    console.log("key down")
    switch(ev.keyCode)
    {
        case 39: // right 
            playerSpaceShip.rotate = -1;
            break;
        case 37:  // left
            playerSpaceShip.rotate = 1;
            break;
        case 38:  // up
            playerSpaceShip.move = -1;
            break;
        case 40: // down
            playerSpaceShip.move = 1;
            break;
        case 32: // space 
            playerSpaceShip.shootLaser();
    }
}


function keyup(ev)
{
    console.log("key up");
    switch(ev.keyCode)
    {
        case 39:
            playerSpaceShip.rotate = 0;
            break;
        case 37:
            playerSpaceShip.rotate = 0;
            break;
        case 38:
            playerSpaceShip.move = 0;
            break;
        case 40:
            playerSpaceShip.move = 0;
    }
}


function gameLoop()
{
    
    // clear the screen 
    cntx.fillStyle = 'black';
    cntx.fillRect(0 , 0, can.width, can.height);
    
    // update states of the game objects 
    playerSpaceShip.update();
    rockEnemy.update();

    
    // render the game objects
    playerSpaceShip.render();
    rockEnemy.render(); 
}



var playerSpaceShip = new spaceShip(400, 400, speedX=100, speedY=100, rotationSpeed=50, circleDiameter = 100, laserRange = 100, angle = 90, color='red');

var rockEnemy = new rock(400 , 400, speedX=100, speedY=100, rotationSpeed=50, circleDiameter = 200, angle = 90, numberOfVertices = 4, lineWidth = '4', color='green')

console.log("start the game");
setInterval(gameLoop, 1000/FPS);
console.log("end the game")