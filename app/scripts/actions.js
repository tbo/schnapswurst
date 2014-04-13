function bulletHitPlayer (tank, bullet) {
    playerHealth -= 10;
    bullet.kill();
    if(playerHealth <= 0) {
      playerDies();
    }
}

function playerDies() {
  tank.kill();
  turret.kill();
  shadow.kill();
  var explosionAnimation = explosions.getFirstExists(false);
  explosionAnimation.reset(tank.x, tank.y);
  explosionAnimation.play('kaboom', 30, false, true);
  explodeAudio.play();
  gameoverAudio.play();
}

function bulletHitEnemy (tank, bullet) {
    bullet.kill();
    var destroyed = enemies[tank.name].damage();

    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(tank.x, tank.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }
}

function fire () {
    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        playerGunAudio.play();
        nextFire = game.time.now + fireRate;
        var bullet = bullets.getFirstExists(false);
        bullet.reset(turret.x, turret.y);
        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
    }
}
