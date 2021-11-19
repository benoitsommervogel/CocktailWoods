// Create the game canvas

var cocanvas = null;
var currentScene = null;
var MS_PER_UPDATE = 25;
var lag = 0;

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
    for (var key in currentScene.spriteList) {
      currentScene.spriteList[key].render(this.ctx, this.ratio);
    }
  }
}

// Game scene
class Scene {
  constructor() {
    currentScene = this;
    this.spriteList = {};
    this.triggerList = {};
  }

  activate() {
    currentScene = this;
  }

  addSprite(sprite) {
    this.spriteList[sprite.id] = sprite;
  }

  addTrigger(trigger) {
    this.triggerList[trigger.id] = trigger;
  }

  deleteSprite(spriteId) {
    delete this.spriteList[spriteId]
  }

  deleteTrigger(triggerId) {
    delete this.triggerList[triggerId]
  }

}

// Sprite
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
  constructor(posx, posy, opt, scene) {
    this.scene = scene;
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
      this.scene.deleteTrigger(this.triggers[key].id);
    }
    for (var key in this.sprites) {
      this.scene.deleteSprite(this.sprites[key].id);
    }
    delete objectList[this.id];
  }

  addTrigger(trigger) {
    this.triggers.push(trigger);
  }

  changeSprite(label) {
    if (this.current_sprite_id != null) {
      this.scene.deleteSprite(this.current_sprite_id);
    }
    this.current_sprite_id = this.sprites[label].id;
    this.scene.addSprite(this.sprites[label]);
  }

  addSprite(filename, label) {
    this.sprites[label] = new Sprite(filename, this);
    this.changeSprite(label);
  }
}

// Trigger
var maxtriggerId = 0;

class Trigger {
  constructor(callback, object) {
    this.object = object;
    this.callback = callback;
    object.addTrigger(this);
    this.id = maxtriggerId;
    maxtriggerId += 1;
    object.scene.addTrigger(this);
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
  then = now;
  lag += delta

  if (currentScene != null) {
    for (var key in currentScene.triggerList) {
      currentScene.triggerList[key].callCallback(delta / 1000);
    }
    while (lag >= MS_PER_UPDATE)
    {
      if (cocanvas) {
        cocanvas.render();
      }
      lag -= MS_PER_UPDATE;
    }
  }
  // Request to do this again ASAP
  requestAnimationFrame(main);
};
var then = Date.now();
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
