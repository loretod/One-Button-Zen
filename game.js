// initialize context
kaboom({
	background: [ 175,238,238 ],
});


// load game assests

//images
loadSprite("yellow_fish", "/sprites/yellow_fish.png")
loadSprite("seaweed", "/sprites/Seaweed.png")

//sounds
loadSound("soundtrack", "/sounds/soundtrack.mp3")
loadSound("bubbles", "/sounds/bubbles.wav")
loadSound("pop", "/sounds/pop.ogg")


//Game Variables- edit as needed to meet the player's skills
// Score to reach
WIN_SCORE = 10
// Seconds between when next food pellet spawns
TARGET_SPAWN_TIMING = 4
// Size of target- range from 
TARGET_SIZE = rand(10,70)
// How long will the target stay on the screen
TARGET_TIME = 6
// Opt to spawn seeweed (true) or not (false)
SPAWN_SEAWEED = true
// Size of fishe's bubble
BUBBLE_SIZE = 20
//Speed that bubble travels up
BUBBLE_SPEED = 400
// Music on (true) or off (false)
MUSIC = true
// Outline thickness of target and bubbles
OUTLINE_SIZE = 4



// new functions for the game
//creates bubbles
function spawnBubble(p) {
		const bubble = add([
			circle(BUBBLE_SIZE),
			area({ width: BUBBLE_SIZE*2, height: BUBBLE_SIZE*2 }),
			pos(p),
			origin("center"),
			color(192,192,192),
			outline(OUTLINE_SIZE),
			move(UP, BUBBLE_SPEED),
			cleanup(),
			// strings here means a tag
			"bubble",
		])
	}

//creates food bubbles
function spawnTarget(p) {
		const target = add([
      area({width: TARGET_SIZE*2, height: TARGET_SIZE*2}),
			pos(rand(0,width()),rand(0,height()-300)),
      circle(TARGET_SIZE),
      origin("center"),
      outline(OUTLINE_SIZE),
      lifespan(TARGET_TIME, {fade: 0.5}),
      color(hsl2rgb(wave(0, 1, time()), 0.6, 0.6)),
      "target",
		])
	}

// adding assets to the game

//the ground
add([
	rect(width(),20),
	pos(0, height() - 20),
	area(),
  solid(),
  color(245,200,178),
	"ground"
])

//the fish
const fish = add([
	sprite("yellow_fish"),
	pos(width()/2,height()-50),
	origin("center"),
	area(),
  body(),
  scale(.1),
	"fish",
  {
		speed: rand(120, 200),
		dir: choose([-1, 1])
	},
])

// the seaweed
if (SPAWN_SEAWEED == true){
  for (let i = 0; i < 3; i++) {
    const x = rand(0, width())

    add([
      sprite("seaweed"),
      pos(x, height()-10),
      origin("bot"),
      scale(rand(1.2,.5)),
    ])
  }
}

// background music
if (MUSIC == true){
  const music = play("soundtrack", {
    loop: true,
    volume: .1,
  })
}


//score
const score = add([
		text("0", 24),
		pos(24, 24),
		{
			value: 0,
		},
	])

//move the fish right to left and flip when 
onUpdate("fish", (p) => {
		p.move(p.dir * p.speed, 0)
		if (p.pos.x < 0 || p.pos.x > width()) {
			p.dir = -p.dir
      
		}
    //flip the fish when reach the end of the screen
    if (p.pos.x < 10){
      p.flipX(true)
    }
    if (p.pos.x > width()-10){
      p.flipX(false)
    }

    //swim away when reach the win score
    if (score.value >= WIN_SCORE){
      score.pos.x = width()/2
      score.pos.y = height()/2
      score.text = "Yum! Thank you!"
      gravity(4000)
      p.jump()
      cleanup()
    }
})

// release a bubble
onKeyPress(() => {
		spawnBubble(fish.pos)
    play("bubbles")
	})

onCollide("bubble", "target", (b, t) => {
    destroy(t)
    play("pop")
    score.value += 1
		score.text = score.value
  })

loop(TARGET_SPAWN_TIMING, ()=> {
  if (score.value < WIN_SCORE){
    spawnTarget()
  }
})
