var can = document.getElementById('can');
var cntx = can.getContext('2d');
 

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);



can.width = 800;
can.height = 800;


var spaceShip = new astroid(400, 400, 100, 100, 100, 90, 'red', 50, 50);
var rockEnemy = new rock(400, 400,0, 50, 'green', 100, 5);

function keydown(ev)
{
    console.log("key down")
    //console.log(ev.keyCode, typeof ev.keyCode);
    
    switch(ev.keyCode)
    {
        case 39: // right 
            spaceShip.rotate = -1;
            break;
        case 37:  // left
            spaceShip.rotate = 1;
            break;
        case 38:  // up
            spaceShip.move = -1;
            break;
        case 40: // down
            spaceShip.move = 1;
            break;
        case 32: // space 
            spaceShip.shootLaser();
    }
}


function keyup(ev)
{
    console.log("key up");
    
    switch(ev.keyCode)
    {
        case 39:
            spaceShip.rotate = 0;
            break;
        case 37:
            spaceShip.rotate = 0;
            break;
        case 38:
            spaceShip.move = 0;
            break;
        case 40:
            spaceShip.move = 0;
    }
}


function gameLoop()
{
 
    // update state of user space ship 
    spaceShip.update();
    
    
    // delete the screen 
    cntx.fillStyle = 'black';
    cntx.fillRect(0 , 0, can.width, can.height);
    
    // render the space ship 
    spaceShip.render();
    rockEnemy.render();
    rockEnemy.move();
    
    // update the state of the rocks 
    
    
    // render the rocks 
}

console.log("start the game");
setInterval(gameLoop, 1000/FPS);
console.log("end the game")