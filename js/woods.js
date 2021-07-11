var monstersCaught = 0;
var canvas = new CocktailCanvas(256, 176, "assets/images/background.png");


var hero = new GameObject(256 / 2, 176 / 2)
var monster = new GameObject(32 + (Math.random() * (256 - 64)), 32 + (Math.random() * (176 - 64)))
var monster2 = new GameObject(32 + (Math.random() * (256 - 64)), 32 + (Math.random() * (176 - 64)))

var sprite1 = new Sprite("assets/images/hero.png", hero)
var sprite2 = new Sprite("assets/images/monster.png", monster)
var sprite3 = new Sprite("assets/images/monster.png", monster2)

var moveHero = new Trigger(function(object, delta) {
  if ("ArrowUp" in keysDown) { // Player holding up
    object.y -= 50 * delta;
  }
  if ("ArrowDown" in keysDown) { // Player holding down
    object.y += 50 * delta;
  }
  if ("ArrowLeft" in keysDown) { // Player holding left
    object.x -= 50 * delta;
  }
  if ("ArrowRight" in keysDown) { // Player holding right
    object.x += 50 * delta;
  }
}, hero);

var destroyMonster = function(object, delta) {
  // Are they touching?
  if (
    hero.x <= (object.x + 16)
    && object.x <= (hero.x + 16)
    && hero.y <= (object.y + 16)
    && object.y <= (hero.y + 16)
  ) {
    ++monstersCaught;
    object.x = 32 + (Math.random() * (canvas.canvas.width - 64));
    object.y = 32 + (Math.random() * (canvas.canvas.height - 64));
  }
}

var destroyMonsterTrigger = new Trigger(destroyMonster, monster)
var destroyMonsterTrigger = new Trigger(destroyMonster, monster2)

// Let's play this game!
main();