// Create the game canvas

var cocanvas = null;

class CocktailCanvas {
  constructor(width, height, bgImage, ratio) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;
    this.ratio = ratio > 0 ? ratio : 1;
    document.body.appendChild(this.canvas);
    this.bgReady = false;
    this.bgImage = new Image();
    this.bgImage.onload = function () {
      this.bgReady = true;
    }.bind(this);
    this.bgImage.src = bgImage;
    cocanvas = this;
  }

  render(params) {
    if (this.bgReady) {
      this.ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    spriteList.forEach(function (sprite) {
      sprite.render(this.ctx, this.ratio);
    }.bind(this))
  }
}

// Game scene
class Scene {

}

// Sprite
var spriteList = []

class Sprite {
  constructor(spriteSrc, gameObject) {
    this.ready = false;
    this.gameObject = gameObject;
    this.gameObject.addSprite(this);
    this.image = new Image();
    this.image.onload = function () {
      this.ready = true;
    };
    this.image.src = spriteSrc;
    spriteList.push(this);
  }

  render(ctx, ratio) {
    ctx.drawImage(this.image, this.gameObject.x, this.gameObject.y, this.image.width * ratio, this.image.height * ratio);
  }
}

// Game objects
var objectList = [];

class GameObject {
  constructor(posx, posy, opt) {
    this.x = posx;
    this.y = posy;
    this.opt = opt;
    this.sprite = null;
    this.triggers = [];
    objectList.push(this);
  }

  destroy() {
    delete spriteList[this.sprite]
    this.triggers.forEach(function (trigger) {
      delete triggerList[trigger]
    })
    delete objectList[this]
  }

  addTrigger(trigger) {
    this.triggers.push(trigger);
  }

  addSprite(sprite) {
    this.sprite = sprite;
  }
}

// Trigger
triggerList = []

class Trigger {
  constructor(callback, object) {
    this.object = object;
    this.callback = callback;
    object.addTrigger(this);
    triggerList.push(this);
  }

  callCallback(delta) {
    this.callback(this.object, delta);
  }
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.key];
}, false);

// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  triggerList.forEach(function (trigger) {
   trigger.callCallback(delta / 1000)
  })
  if (cocanvas) {
    cocanvas.render();
  }
  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};
var then = Date.now();
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
