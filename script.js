/**
 * @author Zach Kiser
 * @version 8/7/22
 */

// Boundaries for playable area.
const leftBoundary = 0;
const rightBoundary = 360;



function Character(xPos, yPos) {
  // Declarations for the variables that will hold the setIntervals for the animations.
  this.jumpingAnimation;
  this.punchingAnimation;
  this.readyAnimation;

  this.isIdleRunning = false;
  this.isJumping = false;
  this.isCrouching = false;
  this.isPunching = false;
  this.isMoving = false;
  this.gravity = 1.2;
  this.falling = false;
  this.reverse = 0;

  // Divides the sprite sheet into animations and determines the current frame
  this.xPosSlicer = 0;
  this.yPosSlicer = 0;

  this.xPos = xPos;
  this.yPos = yPos;

}

player = new Character(0, 0);
opponent =  new Character(0, 0);
pressedKeys = {
  left: false,
  right: false,
  up: false,
  down: false,
  punch: false,
  w: false,
  a: false,
  s: false,
  d: false,
};


/**
 * Updates the state of the world for the elapsed time since the last render. 
 * This is where the bulk of the actual game logic takes place.
 * Changes to the appropriate animation or moves the character accordingly.
 * 
 * @param {var} progress   The time between renders which is used to create smooth animations.
 */
 function update(progress) {
  
  // Jump movement.
  if (!player.isJumping && !player.isPunching && pressedKeys.w){
      player.isJumping = true;
      player.isCrouching = false;
      window.clearInterval(player.readyAnimation);
      player.jumpingAnimation = window.setInterval(jump, 10);
  }

  if (!opponent.isJumping && pressedKeys.up){
    opponent.isJumping = true;
    opponent.isCrouching = false;
    window.clearInterval(opponent.readyAnimation);
    opponent.jumpingAnimation = window.setInterval(jumpOpponent, 10);
}

  // Left movement.
  if (!player.isCrouching && pressedKeys.a){
    if (player.xPos - 4 >= leftBoundary){
      player.xPos = player.xPos - 3;
    }
  }

  if (!opponent.isCrouching && pressedKeys.left){
    if (opponent.xPos + 4 <= rightBoundary){
      opponent.xPos = opponent.xPos + 3;
    }
  }

  // Right movement.

  if (!player.isCrouching && pressedKeys.d){
    if (player.xPos + 4 <= rightBoundary){
      player.xPos = player.xPos + 3;
    }
  }

  if (!opponent.isCrouching && pressedKeys.right){
    if (opponent.xPos - 4 >= leftBoundary){
      opponent.xPos = opponent.xPos - 3;
    }
  }

  // Crouch movement.
  if (!player.isJumping && !player.isPunching && pressedKeys.s){
    player.isCrouching = true;
    window.clearInterval(player.readyAnimation);
    player.isIdleRunning = false;
    player.xPosSlicer = 286; 
  }

    if (!opponent.isJumping && pressedKeys.down){
      opponent.isCrouching = true;
      window.clearInterval(opponent.readyAnimation);
      opponent.isIdleRunning = false;
      opponent.xPosSlicer = 286; 
    }

  // Moves the character from crouching back to the idle animation.
  if (!pressedKeys.s){
    player.isCrouching = false;
    if (!player.isIdleRunning && !player.isJumping && !player.isPunching){
      player.isIdleRunning = true;
      resetIdleVariables();
      player.readyAnimation = window.setInterval(updateReadyAnimation, 180);
    }
  }

  if (!pressedKeys.down){
    opponent.isCrouching = false;
    if (!opponent.isIdleRunning && !opponent.isJumping){
      opponent.isIdleRunning = true;
      resetOpponentIdleVariables();
      opponent.readyAnimation = window.setInterval(updateOpponentReadyAnimation, 180);
    }
  }

  // Punch movement.

  if (!player.isCrouching && !player.isJumping &&  !player.isPunching && pressedKeys.f){
    player.isPunching = true;
    window.clearInterval(player.readyAnimation);
    player.isIdleRunning = false;
    resetIdleVariables();
    player.punchingAnimation = window.setInterval(punch, 130);
  }

  if (!opponent.isCrouching && !opponent.isJumping &&  !opponent.isPunching && pressedKeys.punch){
    opponent.isPunching = true;
    window.clearInterval(opponent.readyAnimation);
    opponent.isIdleRunning = false;
    resetOpponentIdleVariables();
    opponent.punchingAnimation = window.setInterval(punchOpponent, 130);
  }

  




}

/**
 * Used to set the character in the game screen with each render.
 * Uses character position and animation variables to update the character's 
 * position in the world and the current animation frame.
 */
function draw() {
  // Draws the state of the world.                         
  document.getElementById("Player").style.transform = "scale(1.7, 1.7) translate(" + player.xPos + "px, " + player.yPos + "px)";
  // As far as I am aware, I need to apply the scale each time I use transform.
  document.getElementById("Player").style.backgroundPosition=`-${player.xPosSlicer}px 
    -${player.yPosSlicer}px`;
  document.getElementById("opponent").style.transform = "scale(1.7, 1.7) ScaleX(-1) translate(" + opponent.xPos + "px, " + opponent.yPos + "px)";
  // As far as I am aware, I need to apply the scale each time I use transform.
  document.getElementById("opponent").style.backgroundPosition=`-${opponent.xPosSlicer}px 
    -${opponent.yPosSlicer}px`;
}

/**
 * One of the most important functions which renders the animations in the game. 
 * The loop function updates the state of position variables and then 
 * updates the game screen. 
 * 
 * Tutorial code for animations was found at
 * https://www.sitepoint.com/quick-tip-game-loop-in-javascript/
 * 
 * @param {var} timestamp   The time since the program began.
 */
function loop(timestamp) {
  var progress = timestamp - lastRender;

  update(progress);
  draw();

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}
var lastRender = 0;
window.requestAnimationFrame(loop);
// Runs the loop function with the timestamp parameter.







var keyMap = {
  //Player 1 (Superman) keys.
  87: 'w',
  65: 'a',
  83: 's',
  68: 'd',
  70: 'f',
  //Player 2 keys.
  39: 'right',
  37: 'left',
  38: 'up',
  40: 'down',
  77: 'punch',

}

/**
 * Determines which key is currently being pressed and updates the
 * corresponding key variable.
 * 
 * @param {var} event     Passes the key pressed to the function.
 */
function keydown(event) {
  var key = keyMap[event.keyCode];
  pressedKeys[key] = true;
}

/**
 * Determines which key is released and updates the corresponding key variable.
 * 
 * @param {var} event     Passes the key pressed to the function.
 */
function keyup(event) {
  var key = keyMap[event.keyCode];
  pressedKeys[key] = false;
}
window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);



var ready = false;
// Used to start the animation after the user clicks 'start'.

/**
 * Starts the game after the user clicks 'start'.
 * Hides the menu text and shows the character and background images.
 */
function startGame() {
  document.getElementById("start").style.display = "none";
  document.getElementById("title").style.display = "none";
  document.getElementById("Player").style.display = "block";
  document.getElementById("opponent").style.display = "block";
  document.getElementById("background").style.display = "block";
  document.getElementById("characterPortrait").style.display = "block";
  document.getElementById("enemyPortrait").style.display = "block";
  document.getElementById("foreground").style.display = "block";
  document.getElementById("playerhealthbar").style.display = "block";
  document.getElementById("enemyhealthbar").style.display = "block";
  document.getElementById("logo").style.display = "block";
  ready = true;
}



// All of the important player positioning functions are below. 
// Although I know it is much better practice to resuse code, I had difficulty 
// creating implementing the below functions in the character class
// in Javascript that would allow me to resuse the code
// for both the player and the opponent. I decided to temporarily use separate
// functions until I figure it out.



  /**
   * Updates the ready animation for the player character
   * (when they are just standing around and not attacking).
   */
 function updateReadyAnimation() {
  if (ready){
    if (player.xPosSlicer < 132 && player.reverse != 1) {
      player.xPosSlicer = player.xPosSlicer + 66;
    }
    else if (player.xPosSlicer == 132){
      player.reverse = 1;
      player.xPosSlicer = 66;
    }
    else if (player.xPosSlicer == 66) {
      resetIdleVariables();
    }
  }
}

  /**
   * Updates the ready animation for the opponent character
   * (when they are just standing around and not attacking).
   */
function updateOpponentReadyAnimation() {
  if (ready){
    if (opponent.xPosSlicer < 132 && opponent.reverse != 1) {
      opponent.xPosSlicer = opponent.xPosSlicer + 66;
    }
    else if (opponent.xPosSlicer == 132){
      opponent.reverse = 1;
      opponent.xPosSlicer = 66;
    }
    else if (opponent.xPosSlicer == 66) {
      resetOpponentIdleVariables();
    }
  }
}

/**
* Updates the character position and animation variables for
* when the character jumps.
*/
function jump() {
  if (!player.falling && player.yPos>=-30) {
    player.yPos-=player.gravity;
    player.xPosSlicer = 13;
    player.yPosSlicer = 120;
  } else if (player.yPos<=-0.3) {
    player.falling = true;
    player.xPosSlicer = 175;
    player.yPosSlicer = 125;
    player.yPos+=player.gravity;
  } else {
    player.falling = false;
    player.isJumping = false;
      window.clearInterval(player.jumpingAnimation);
      resetIdleVariables();
      player.readyAnimation = window.setInterval(updateReadyAnimation, 160);
  }
}

/**
* Updates the opponent position and animation variables for
* when the opponent jumps.
*/
function jumpOpponent() {
  if (!opponent.falling && opponent.yPos>=-30) {
    opponent.yPos-=player.gravity;
    opponent.xPosSlicer = 13;
    opponent.yPosSlicer = 120;
  } else if (opponent.yPos<=-0.3) {
    opponent.falling = true;
    opponent.xPosSlicer = 175;
    opponent.yPosSlicer = 125;
    opponent.yPos+=opponent.gravity;
  } else {
    opponent.falling = false;
    opponent.isJumping = false;
      window.clearInterval(opponent.jumpingAnimation);
      resetOpponentIdleVariables();
      opponent.readyAnimation = window.setInterval(updateOpponentReadyAnimation, 160);
  }
}


/**
* Updates the character animation variables for when the player punches.
*/
function punch() {
  if (player.isPunching && player.xPosSlicer < 15){
    player.yPosSlicer = 226;
    player.xPosSlicer = 15;
  } else if (player.xPosSlicer == 15) {
    document.getElementById("Player").style.width = "75px";
    player.xPosSlicer += 70;
  } else {
    document.getElementById("Player").style.width = "66px";
    player.isPunching = false;
    window.clearInterval(player.punchingAnimation);
    resetIdleVariables();
  }
}

/**
* Updates the character animation variables for when the opponent punches.
*/
function punchOpponent() {
  if (opponent.isPunching && opponent.xPosSlicer < 15){
    opponent.yPosSlicer = 226;
    opponent.xPosSlicer = 15;
  } else if (opponent.xPosSlicer == 15) {
    document.getElementById("opponent").style.width = "75px";
    opponent.xPosSlicer += 70;
  } else {
    document.getElementById("opponent").style.width = "66px";
    opponent.isPunching = false;
    window.clearInterval(opponent.punchingAnimation);
    resetOpponentIdleVariables();
  }
}

/**
* Called before setting a new interval for updating the player's idle animation.
* This ensures that the position for the slicer is never outside of the required range
* and will always restart on the same frame
*/
function resetIdleVariables() {
  player.xPosSlicer = 0;
  player.yPosSlicer = 0;
  player.yPos = 0;
  player.isJumping = false;
  player.falling = false;
  player.reverse = 0;
}

/**
* Called before setting a new interval for updating the opponent's idle animation.
* This ensures that the position for the slicer is never outside of the required range
* and will always restart on the same frame
*/
function resetOpponentIdleVariables() {
  opponent.xPosSlicer = 0;
  opponent.yPosSlicer = 0;
  opponent.yPos = 0;
  opponent.isJumping = false;
  opponent.falling = false;
  opponent.reverse = 0;
}
