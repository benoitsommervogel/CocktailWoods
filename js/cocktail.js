// Create the game canvas

var cocanvas = null;
var currentScene = null;
var MS_PER_UPDATE = 25;
var lag = 0;

class ImageBuilder {
  constructor(width, height, base, sprite_list) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
    this.element_total = sprite_list.length;
    this.element_count = 0;
    this.base = new Image();
    this.base.onload = function () {
      this.ctx.drawImage(this.base, 0, 0, this.canvas.width, this.canvas.height);
      this.constructBackground(sprite_list)
    }.bind(this);
    this.base.src = base;
  }

  // expect a list of images with coordinates to add to the background ["spritepath", x, y]
  constructBackground(sprite_list) {
    var added_element = [];
    for (var key in sprite_list) {
      var added_element = new Image();
      added_element.key = key;
      added_element.constructor = this;
      added_element.onload = function () {
        this.constructor.ctx.drawImage(this, sprite_list[this.key]["x"], sprite_list[this.key]["y"], this.width, this.height);
        this.constructor.element_count++;
      }
      added_element.src = sprite_list[key]["spritePath"];
    }
  }

  onReady(execute, scene) {
    console.log("here")
    var loader = new GameObject(0, 0, {"norepeat": false}, scene);
    var load_image = function(object, delta) {
      if (this.element_count >= this.element_total) {
        execute(this.canvas);
        object.destroy();
      }
    }.bind(this)
    new Trigger(load_image, loader)
  }
}

class CocktailCanvas {
  constructor(width, height, bg_image, ratio) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;
    this.ratio = ratio > 0 ? ratio : 1;
    document.body.appendChild(this.canvas);
    this.bg_ready = false;
    this.bg_image = new Image();
    this.bg_image.onload = function () {
      this.bg_ready = true;
    }.bind(this);
    this.bg_image.src = bg_image;
    cocanvas = this;
  }

  setCanvasBackground(canvas_image) {
    this.canvas.width = canvas_image.width * this.ratio;
    this.canvas.height = canvas_image.height * this.ratio;
    this.bg_image = canvas_image
  }

  render(params) {
    if (this.bg_ready) {
      this.ctx.drawImage(this.bg_image, 0, 0, this.canvas.width, this.canvas.height);
    }
    for (var key in currentScene.sprite_list) {
      currentScene.sprite_list[key].render(this.ctx, this.ratio);
    }
  }
}

// Game scene
class Scene {
  constructor() {
    currentScene = this;
    this.sprite_list = {};
    this.triggerList = {};
  }

  activate() {
    currentScene = this;
  }

  addSprite(sprite) {
    this.sprite_list[sprite.id] = sprite;
  }

  addTrigger(trigger) {
    this.triggerList[trigger.id] = trigger;
  }

  deleteSprite(spriteId) {
    delete this.sprite_list[spriteId]
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
var keysPressed = {};
var keysReleased = {};

addEventListener("keydown", function (e) {
  if (!(e.key in keysDown))
    keysPressed[e.key] = true;
	keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.key];
  keysReleased[e.key] = true;
}, false);

// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;
  then = now;
  lag += delta;

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
  keysPressed = {};
  keysReleased = {};
};
var then = Date.now();
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;