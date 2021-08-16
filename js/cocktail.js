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
    for (var key in spriteList) {
      spriteList[key].render(this.ctx, this.ratio);
    }
  }
}

// Game scene
class Scene {

}

// Sprite
var spriteList = {};
var maxSpriteId = 0;

class Sprite {
  constructor(spriteSrc, gameObject) {
    this.ready = false;
    this.id = maxSpriteId;
    maxSpriteId += 1;
    this.gameObject = gameObject;
    this.image = new Image();
    this.image.onload = function () {
      this.ready = true;
    };
    this.image.src = spriteSrc;
  }

  render(ctx, ratio) {
    ctx.drawImage(this.image, this.gameObject.x, this.gameObject.y, this.image.width * ratio, this.image.height * ratio);
  }
}

// Game objects
var objectList = {};
var maxObjectId = 0;

class GameObject {
  constructor(posx, posy, opt) {
    this.x = posx;
    this.y = posy;
    this.opt = opt;
    this.current_sprite_id = null;
    this.sprites = {};
    this.triggers = [];
    this.id = maxObjectId;
    maxObjectId += 1;
    objectList[this.id] = this;
  }

  destroy() {
    for (var key in this.triggers) {
      delete triggerList[this.triggers[key].id];
    }
    for (var key in this.sprites) {
      delete spriteList[this.sprites[key].id];
    }
    delete objectList[this.id];
  }

  addTrigger(trigger) {
    this.triggers.push(trigger);
  }

  changeSprite(label) {
    if (this.current_sprite_id != null) {
      delete spriteList[this.current_sprite_id]
    }
    this.current_sprite_id = this.sprites[label].id;
    spriteList[this.sprites[label].id] = this.sprites[label];
  }

  addSprite(filename, label) {
    this.sprites[label] = new Sprite(filename, this);
    this.changeSprite(label);
  }
}

// Trigger
var triggerList = {};
var maxtriggerId = 0;

class Trigger {
  constructor(callback, object) {
    this.object = object;
    this.callback = callback;
    object.addTrigger(this);
    this.id = maxtriggerId;
    maxtriggerId += 1;
    triggerList[this.id] = this;
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

  for (var key in triggerList) {
    triggerList[key].callCallback(delta / 1000);
  }
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
