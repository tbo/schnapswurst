function update () {
    game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);
    enemiesAlive = 0;

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemiesAlive++;
            game.physics.arcade.collide(tank, enemies[i].tank);
            game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
            enemies[i].update();
        }
    }

    if(cursors.right.isDown || 
       cursors.left.isDown ||
       cursors.up.isDown ||
       cursors.down.isDown) {
      currentSpeed = 200;
    } else {
      currentSpeed = 0;
    }

    if (cursors.left.isDown && cursors.down.isDown) {
      tank.angle = 135;
    }  else if (cursors.left.isDown && cursors.up.isDown) {
      tank.angle = -135;
    }  else if (cursors.right.isDown && cursors.up.isDown) {
      tank.angle = -45;
    }  else if (cursors.right.isDown && cursors.down.isDown) {
      tank.angle = 45;
    }  else if (cursors.left.isDown) {
      tank.angle = 180;
    } else if (cursors.right.isDown) {
      tank.angle = 0;
    } else if (cursors.down.isDown) {
      tank.angle = 90;
    } else if (cursors.up.isDown) {
      tank.angle = -90;
    }

    game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    //  Position all the parts and align rotations
    shadow.x = tank.x;
    shadow.y = tank.y;
    shadow.rotation = tank.rotation;

    turret.x = tank.x;
    turret.y = tank.y;

    turret.rotation = game.physics.arcade.angleToPointer(turret);

    if (game.input.activePointer.isDown)
    {
        //  Boom!
        fire();
    }
}

function render () {
    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('Health:' + playerHealth + '% Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
}

