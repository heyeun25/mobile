rbvj = function () {

  var circs = [];
  var r = width / 15;
  var j = 0;

  for ( var _y = 50; _y < h - 10; _y += 50) {
    //console.log(_y);
    for ( var _x = 10; _x < w - 10; _x += r ) {
      var x = _x;
      var lw = random( (_y/100), 12 + (_y/100));
      var circle = {
        r: r - 10,
        me: j,
        x: x,
        vol: 0,
        dir: posNeg(),
        y: _y + (10000/_y),
        myfill:'#efcdb6',
        lw: lw
      }
      circs.push( circle );
    }

    j++;
    //console.log(j)
  }

  draw = function () {

    ctx.background( rgb(210,184,142));
    ctx.strokeStyle =rgb(179,141,93);

    for ( var i = 0; i < circs.length; i++ ) {

      var p = circs[ i ];
      var s = p.dir * Sound.mapSound( i, circs.length * 2, 0, 10 );
      p.vol = tween( p.vol, s, 10 );

      ctx.lineWidth = p.lw;
      if ( chance( 2000 ) ) p.dir *= -1;
      ctx.line( p.x, p.vol  + p.y+(1060/p.y), p.x + r , p.y - p.vol+(1000/p.y));


    }

  }

}();
