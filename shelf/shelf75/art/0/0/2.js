rbvj = function(){

var vol = 0;
var gx, gy;

var engine;
reset();

function reset() {
  
  gx =85;
  gy = 100;
  engine = new particleEngine(gx, gy);
  ctx.fillStyle = rgb(255);
  console.log("reset"+gx+gy);
}
  function update() {
    
    for ( var i = 0; i < engine.particles.length; i++ ) {

      b = engine.particles[ i ];

      if ( b.x > width - b.size / 2 || b.x < b.size / 2 ) {
        b.speed_x = b.speed_x * -1;
      }

      if ( b.y < 0 ) {
        b.y = height;
      }
      if ( Sound.volume > 0 ) vol = Sound.mapSound( i, engine.particles.length, 0, 10 );
      //b.x += b.speed_x;
      b.y += b.speed_y - vol / 10;

      b.sz = Math.abs( Math.sin( frameCount / ( 20 + i + vol ) ) * 110 );
    } // end for loop

  }


draw = function() {

  ctx.background(rgb(179,141,93));

  //if (chance(400)) reset();ß
//update();
  for (var i=0; i < engine.particles.length; i++){

    var p = engine.particles[i];
    vol = Sound.mapSound(i%50, 50, 1, engine.grid.spacing_x - 2) + 0.5;
    p.r = tween(p.r, vol, 2);
    ctx.fillRect(p.pos.x - engine.grid.spacing_x/2, p.pos.y - engine.grid.spacing_y/2, p.r/35, ((engine.grid.spacing_y - 2)/2));

  }

}

}();
