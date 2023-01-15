var ratio = 2.5;
var game_scene = new Scene();
var pause_scene = new Scene();

var general_controller_game = new GameObject(0, 0, {"norepeat": false}, game_scene);
var general_controller_pause = new GameObject(0, 0, {"norepeat": false}, pause_scene);
var canvas = new CocktailCanvas(96 * ratio, 96 * ratio, "assets/images/floor.png", ratio);

var hero = new GameObject(60 * ratio, 20 * ratio,
  {
  "up": "ArrowUp",
  "left": "ArrowLeft",
  "right": "ArrowRight",
  "down": "ArrowDown"}, game_scene)

hero.addSprite("assets/images/hero.png", "idle");

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

//Create a background matching the collision map to replace the standard one
var map = [
  [1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1],
];

var mapImage = [];
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (map[i][j] == 1) {
      mapImage.push({"spritePath": "assets/images/wall.png", "x": j * 16, "y": i * 16});
    }
  }
}

var builder = new ImageBuilder(map[0].length * 16, map.length * 16, "assets/images/floor.png", mapImage);
builder.onReady(function(image) {
  canvas.setCanvasBackground(image);
}, game_scene)


var moveHero = new Trigger(moveCharacter, hero);
var swapScene = new Trigger(pause, general_controller_game)
var swapScene2 = new Trigger(resume, general_controller_pause)
game_scene.activate();

// Let's play this game!
main();