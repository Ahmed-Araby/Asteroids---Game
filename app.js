var can = document.getElementById('can');
var cntx = can.getContext('2d');
can.width = 800;
can.height = 800;
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


/*
var playerSpaceShip = new spaceShip(400, 400, speedX=100, speedY=100, rotationSpeed=50, circleDiameter = 100, laserRange = 100, angle = 90, color='red');

var rockEnemy = new rock(400 , 400, speedX=100, speedY=100, rotationSpeed=50, circleDiameter = 200, angle = 90, numberOfVertices = 4, lineWidth = '4', color='green')
*/
var adminObj = new admin(1);

console.log("start the game");
/*
without the brackets the context of "this"
get changed 
*/
setInterval(function (){adminObj.game_loop()}, 1000/FPS);
console.log("end the game")