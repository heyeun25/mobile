rbvj = function(){

var vol = 0;
var gx, gy;

var engine;
reset();

function reset() {
  console.log("reset");
  gx = randomInt(20, 85);
  gy = randomInt(20, 120);
  console.log(gx + " // " + gy);
  engine = new particleEngine(gx, gy);
  ctx.fillStyle = rgb(132,111,63);
}


draw = function() {

  ctx.background(rgb(128, 119, 99));

  //if (chance(400)) reset();

  for (var i=0; i < engine.particles.length; i++){

    var p = engine.particles[i];
    vol = Sound.mapSound(i%100, 100, 1, engine.grid.spacing_x - 2) - random(0.3);
    p.r = tween(p.r, vol, 2);
    ctx.fillRect(p.pos.x - engine.grid.spacing_x/2, p.pos.y - engine.grid.spacing_y/2, p.r/20, engine.grid.spacing_y - 2);

  }

}

}();
