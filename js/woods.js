var ratio = 2.5;
var canvas = new CocktailCanvas(256, 176, "assets/images/background.png", ratio);

var hero = new GameObject(60 * ratio, 20 * ratio,
  {"charge_left": 0,
  "charge_right": 0,
  "charge_up": 0,
  "up": "ArrowUp",
  "left": "ArrowLeft",
  "right": "ArrowRight"})
var hero2 = new GameObject(120 * ratio, 20 * ratio,
  {"charge_left": 0,
  "charge_right": 0,
  "charge_up": 0,
  "up": "z",
  "left": "a",
  "right": "e"})

hero.addSprite("assets/images/hero.png", "idle");
hero2.addSprite("assets/images/hero.png", "idle");
hero.addSprite("assets/images/monster.png", "damage");
hero2.addSprite("assets/images/monster.png", "damage");

var moveCharacter = function(object, delta) {
  if (object.opt["up"] in keysDown) { // Player holding up
    object.opt["charge_up"] += delta;
  } else if (object.opt["charge_up"] > 0) {
    console.log(object.opt["charge_up"] + delta)
    object.opt["charge_up"] = 0;
  }
  if (object.opt["left"] in keysDown) { // Player holding left
    object.opt["charge_left"] += delta;
  } else if (object.opt["charge_left"] > 0) {
    object.changeSprite("idle");
    console.log(object.opt["charge_left"] + delta)
    object.opt["charge_left"] = 0;
    object.x -= 15 * ratio;
  }
  if (object.opt["right"] in keysDown) { // Player holding right
    object.opt["charge_right"] += delta
  } else if (object.opt["charge_right"] > 0) {
    object.changeSprite("damage");
    console.log(object.opt["charge_right"] + delta)
    object.opt["charge_right"] = 0;
    object.x += 15 * ratio;
  }
}

// var destroyMonster = function(object, delta) {
//   // Are they touching?
//   if (
//     hero.x <= (object.x + 16 * ratio)
//     && object.x <= (hero.x + 16 * ratio)
//     && hero.y <= (object.y + 16 * ratio)
//     && object.y <= (hero.y + 16 * ratio)
//   ) {
//     ++monstersCaught;
//     object.x = 32 * ratio + (Math.random() * (canvas.canvas.width - 64 * ratio));
//     object.y = 20 * ratio;
//   }
// }

var moveHero = new Trigger(moveCharacter, hero);
var moveMonster = new Trigger(moveCharacter, hero2);
// var destroyMonsterTrigger = new Trigger(destroyMonster, hero2)

// Let's play this game!
main();