// Create the game canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 256;
canvas.height = 176;
document.body.appendChild(canvas);

// Game scene
class Scene {

}

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "assets/images/background.png";

// Sprite
spriteList = []

class Sprite {
  constructor(spriteSrc, gameObject) {
    this.ready = false
    this.gameObject = gameObject
    gameObject.addSprite(this)
    this.image = new Image();
    this.image.onload = function () {
      this.ready = true;
      console.log(this.ready)
    };
    console.log(this.ready)
    this.image.src = spriteSrc;
    spriteList.push(this);
  }

  render() {
    ctx.drawImage(this.image, this.gameObject.x, this.gameObject.y);
  }
}

// Trigger
class Trigger {
  constructor(trigger, callback, object) {
    
  }

  callCallback() {
    this.callback(this.object)
  }
}

// Game objects
var objectList = [];

class GameObject {
  constructor(posx, posy) {
    this.x = posx;
    this.y = posy;
    this.sprite = null;
    this.triggers = [];
    objectList.push(this);
  }

  set addTrigger(trigger) {
    this.trigger.push(trigger)
  }

  addSprite(sprite) {
    this.sprite = sprite
  }

  set setX (modifier) {
    this.x =- this.x;
  }

  set setY (modifier) {
    this.y =- this.y;
  }
}

var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Rendering function
var render = function () {
  if (bgReady) {
      ctx.drawImage(bgImage, 0, 0);
  }
  spriteList.forEach(function (sprite) {
    sprite.render();
  })

  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Monsterrs caught: " + monstersCaught, 32, 32);
};