
var hero = new GameObject(0, 0)
var monster = new GameObject(0, 0)

var sprite1 = new Sprite("assets/images/hero.png", hero)
var sprite2 = new Sprite("assets/images/monster.png", monster)

var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
    objectList.forEach(function(gameObject) {
      if (38 in keysDown) { // Player holding up
        hero.y -= hero.speed * modifier;
      }
      if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
      }
      if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
      }
      if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
      }
    })
  
      // Are they touching?
      if (
          hero.x <= (monster.x + 32)
          && monster.x <= (hero.x + 32)
          && hero.y <= (monster.y + 32)
          && monster.y <= (hero.y + 32)
      ) {
          ++monstersCaught;
          reset();
      }
  };
  
  // The main game loop
  var main = function () {
      var now = Date.now();
      var delta = now - then;
  
      update(delta / 1000);
      render();
  
      then = now;
  
      // Request to do this again ASAP
      requestAnimationFrame(main);
  };
  
  // Cross-browser support for requestAnimationFrame
  var w = window;
  requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
  
  // Let's play this game!
  var then = Date.now();
  reset();
  main();