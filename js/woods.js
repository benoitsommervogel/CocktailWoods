var ratio = 2.5;
var canvas = new CocktailCanvas(256, 176, "assets/images/background.png", ratio);
var game_scene = new Scene();
var pause_scene = new Scene();

var general_controller_game = new GameObject(0, 0, {"norepeat": false}, game_scene)
var general_controller_pause = new GameObject(0, 0, {"norepeat": false}, pause_scene)

var hero = new GameObject(60 * ratio, 20 * ratio,
  {"charge_left": 0,
  "charge_right": 0,
  "charge_up": 0,
  "up": "ArrowUp",
  "left": "ArrowLeft",
  "right": "ArrowRight",
  "down": "ArrowDown"}, game_scene)
var hero2 = new GameObject(120 * ratio, 20 * ratio,
  {"charge_left": 0,
  "charge_right": 0,
  "charge_up": 0,
  "up": "z",
  "left": "a",
  "right": "e",
  "down": "s"}, game_scene)

hero.addSprite("assets/images/hero.png", "idle");
hero2.addSprite("assets/images/hero.png", "idle");
hero.addSprite("assets/images/monster.png", "damage");
hero2.addSprite("assets/images/monster.png", "damage");

// var moveCharacter = function(object, delta) {
//   if (object.opt["up"] in keysDown) { // Player holding up
//     object.opt["charge_up"] += delta;
//   } else if (object.opt["charge_up"] > 0) {
//     console.log(object.opt["charge_up"] + delta)
//     object.opt["charge_up"] = 0;
//   }
//   if (object.opt["left"] in keysDown) { // Player holding left
//     object.opt["charge_left"] += delta;
//   } else if (object.opt["charge_left"] > 0) {
//     console.log(object.opt["charge_left"] + delta)
//     object.opt["charge_left"] = 0;
//     object.x -= 15 * ratio;
//   }
//   if (object.opt["right"] in keysDown) { // Player holding right
//     object.opt["charge_right"] += delta
//   } else if (object.opt["charge_right"] > 0) {
//     console.log(object.opt["charge_right"] + delta)
//     object.opt["charge_right"] = 0;
//     object.x += 15 * ratio;
//   }
// }

var moveCharacter = function(object, delta) {
  if (object.opt["up"] in keysDown) { // Player holding up
    object.y -= 2 * ratio;
  }
  if (object.opt["down"] in keysDown) { // Player holding up
    object.y += 2 * ratio;
  }
  if (object.opt["left"] in keysDown) { // Player holding left
    object.x -= 2 * ratio;
  }
  if (object.opt["right"] in keysDown) { // Player holding right
    object.x += 2 * ratio;
  }
}

var resume = function(object, delta) {
  if ("p" in keysPressed) {
    game_scene.activate();
  }
}

var pause = function(object, delta) {
  if ("p" in keysPressed) {
    pause_scene.activate();
  }
}

var moveHero = new Trigger(moveCharacter, hero);
var moveMonster = new Trigger(moveCharacter, hero2);
var swapScene = new Trigger(pause, general_controller_game)
var swapScene = new Trigger(resume, general_controller_pause)
game_scene.activate();

// Let's play this game!
main();