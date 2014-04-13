var land;

var shadow;
var tank;
var turret;

var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;

var logo;

var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 100;
var nextFire = 0;
var playerHealth = 100;
// var pomelo = window.pomelo;
//
// var host = "127.0.0.1";
// var port = "3010";
// pomelo.init({
//   host: host,
//   port: port,
//   log: true
// });

var screenHeight = $(document).height();
var screenWidth = $(document).width();
var game = new Phaser.Game(screenWidth, screenHeight, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var playerGunAudio = null;
var enemyGunAudio = null;

function preload () {
    game.load.atlas('tank', 'assets/games/tanks/tanks_empty.png', 'assets/games/tanks/tanks.json');
    game.load.atlas('empty', 'assets/games/tanks/tanks_empty.png', 'assets/games/tanks/tanks.json');
    game.load.atlas('enemy', 'assets/games/tanks/enemy-tanks.png', 'assets/games/tanks/tanks.json');
    game.load.image('logo', 'assets/games/tanks/logo.png');
    game.load.image('turret', 'assets/games/tanks/turret.png');
    game.load.image('bullet', 'assets/games/tanks/bullet.png');
    game.load.image('earth', 'assets/games/tanks/scorched_earth.png');
    game.load.spritesheet('kaboom', 'assets/games/tanks/explosion.png', 64, 64, 23);
    game.load.audio('shot', ['assets/audio/SoundEffects/shotgun_low.wav']);
    game.load.audio('cannon', ['assets/audio/SoundEffects/shot1_low.wav']);
    game.load.audio('explode', ['assets/audio/SoundEffects/explode1.wav']);
    game.load.audio('gameover', ['assets/audio/SoundEffects/player_death.wav']);
    game.load.audio('music', ['assets/audio/teenspirit.mp3']);
}

function create () {
    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);
    playerGunAudio = game.add.audio('shot');
    enemyGunAudio = game.add.audio('cannon');
    explodeAudio = game.add.audio('explode');
    gameoverAudio = game.add.audio('gameover');

    music = game.add.audio('music',1,true);
    music.play('',0,1,true);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, screenWidth, screenHeight, 'earth');
    land.fixedToCamera = true;

    tank = game.add.sprite(0, 0, 'empty', 'shadow');
    tank.anchor.setTo(0.5, 0.5);
    //  The base of our tank
    // tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

    //  This will force it to decelerate and limit its speed
    game.physics.enable(tank, Phaser.Physics.ARCADE);
    tank.body.drag.set(0.2);
    tank.body.maxVelocity.setTo(400, 400);
    tank.body.collideWorldBounds = true;

    //  Finally the turret that we place on-top of the tank body
    turret = game.add.image(0, 0, 'turret');
    turret.anchor.setTo(0.3, 0.62);

    //  The enemies bullet group
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(100, 'bullet');
    
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  Create some baddies to waste :)
    enemies = [];

    enemiesTotal = 20;
    enemiesAlive = 20;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new EnemyTank(i, game, tank, enemyBullets));
    }

    //  A shadow below our tank
    shadow = game.add.sprite(0, 0, 'empty', 'shadow');
    shadow.anchor.setTo(0.5, 0.5);

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    tank.bringToTop();
    turret.bringToTop();

    // logo = game.add.sprite(0, 200, 'logo');
    // logo.fixedToCamera = true;

    game.input.onDown.add(removeLogo, this);

    game.camera.follow(tank, Phaser.Camera.FOLLOW_LOCKON);
    game.camera.focusOnXY(0, 0);

    cursors = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };
}

function removeLogo () {
    game.input.onDown.remove(removeLogo, this);
    // logo.kill();
}


