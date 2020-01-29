// Socket.IO Connection & Handling
var socket = io.connect(location.origin, {reconnect: true});
var nfcFlag = false;

const audioElement = document.getElementById('music');
var rbvj;

// add drawing canvases
var ctx = createCanvas( 'canvas1' );
var ctx2 = createCanvas( 'canvas2' );
var ctx3 = createCanvas( 'canvas3' );

var renderer = new THREE.WebGLRenderer( {
  alpha: true,
  antialias: true
} );

var art_location = "/art";

var fileref;
var current_file = 0;
var current_set = 0;
var current_bank = 0;

socket.on('connect', function () {
    console.log("Connected!");
});


socket.on('appMsg',function(data){
    console.log("appMsg Target(" + data.target.toUpperCase() + "), EVT(" + data.evtName + ")");

    if(data.target.toUpperCase() == 'SHELF75') {
        // if(data.evtName == 'play') {
        //     $('.introVideo').addClass('show');
        //     $('.introVideo').get(0).currentTime = 0;
        //     const playPromise = $('.introVideo').get(0).play();
        //     if (playPromise !== null){
        //         playPromise.catch(() => { $('.introVideo').get(0).play(); })
        //     }
        // }
        // else if(data.evtName == 'pause') {
        //     $('.introVideo').get(0).pause();
        // }
        // else if(data.evtName == 'resume') {
        //     $('.introVideo').addClass('show');
        //     const playPromise = $('.introVideo').get(0).play();
        //     if (playPromise !== null){
        //         playPromise.catch(() => { $('.introVideo').get(0).play(); })
        //     }
        // }
        $('.videosrc').get(0).pause();
        $('.musicText').css('opacity', 0);
        if(data.evtName == 'refresh') {
            location.reload();
        }
        else if(data.evtName == null) {
            $('.introVideo').removeClass('show');
            $('.background1').css('opacity', 0);
            $('.background2').css('opacity', 0);
            $('.background3').css('opacity', 0);
            $('.background4').css('opacity', 0);
            $('.background5').css('opacity', 0);
            $('.background6').css('opacity', 0);
            $('.background12').css('opacity', 0);
            $('.background13').css('opacity', 0);
            $('.background14').css('opacity', 0);
            $('.background15').css('opacity', 0);

            $('canvas').css('opacity', 0);
            $('.colorPick').css('opacity',1);
        }
        else if(data.evtName == 'color'){
            $('.colorPick').css('background',data.color);
        }
        else if(data.evtName == 'theme_4'){
            $('.background1').css('opacity', 1);
            $('.background2').css('opacity', 0);
            $('.background3').css('opacity', 0);
            $('.background4').css('opacity', 0);
            $('.background5').css('opacity', 0);
            $('.background6').css('opacity', 0);
            $('.background12').css('opacity', 0);
            $('.background13').css('opacity', 0);
            $('.background14').css('opacity', 0);
            $('.background15').css('opacity', 0);
            $('.colorPick').css('opacity',0);
            $('canvas').css('opacity', 0);
            audioElement.pause();
        }
        else if(data.evtName == 'theme_5'){
            $('.background1').css('opacity', 0);
            $('.background2').css('opacity', 1);
            $('.background3').css('opacity', 0);
            $('.background4').css('opacity', 0);
            $('.background5').css('opacity', 0);
            $('.background6').css('opacity', 0);
            $('.background12').css('opacity', 0);
            $('.background13').css('opacity', 0);
            $('.background14').css('opacity', 0);
            $('.background15').css('opacity', 0);
            $('.colorPick').css('opacity',0);
            $('canvas').css('opacity', 0);
            audioElement.pause();
        }
        else if(data.evtName == 'theme_6'){
            $('.background1').css('opacity', 0);
            $('.background2').css('opacity', 0);
            $('.background3').css('opacity', 1);
            $('.background4').css('opacity', 0);
            $('.background5').css('opacity', 0);
            $('.background6').css('opacity', 0);
            $('.background12').css('opacity', 0);
            $('.background13').css('opacity', 0);
            $('.background14').css('opacity', 0);
            $('.background15').css('opacity', 0);
            $('.colorPick').css('opacity',0);
            $('canvas').css('opacity', 0);
            audioElement.pause();
        }    
        else if(data.evtName == 'theme_7'){
            $('.background1').css('opacity', 0);
            $('.background2').css('opacity', 0);
            $('.background3').css('opacity', 0);
            $('.background4').css('opacity', 1);
            $('.background5').css('opacity', 0);
            $('.background6').css('opacity', 0);
            $('.background12').css('opacity', 0);
            $('.background13').css('opacity', 0);
            $('.background14').css('opacity', 0);
            $('.background15').css('opacity', 0);
            $('.colorPick').css('opacity',0);
            $('canvas').css('opacity', 0);
            audioElement.pause();
        }  
        else if(data.evtName == 'theme_8'){
            $('.background1').css('opacity', 0);
            $('.background2').css('opacity', 0);
            $('.background3').css('opacity', 0);
            $('.background4').css('opacity', 0);
            $('.background5').css('opacity', 1);
            $('.background6').css('opacity', 0);
            $('.background12').css('opacity', 0);
            $('.background13').css('opacity', 0);
            $('.background14').css('opacity', 0);
            $('.background15').css('opacity', 0);
            $('.colorPick').css('opacity',0);
            $('canvas').css('opacity', 0);
            audioElement.pause();
        }  
        else if(data.evtName == 'theme_9'){
            $('.background1').css('opacity', 0);
            $('.background2').css('opacity', 0);
            $('.background3').css('opacity', 0);
            $('.background4').css('opacity', 0);
            $('.background5').css('opacity', 0);
            $('.background12').css('opacity', 0);
            $('.background13').css('opacity', 0);
            $('.background14').css('opacity', 0);
            $('.background15').css('opacity', 0);
            $('.background6').css('opacity', 1);
            $('.colorPick').css('opacity',0);
            $('canvas').css('opacity', 0);
            audioElement.pause();
            $('.videosrc').get(0).play();
        }  
        else if(data.evtName == 'theme_12'){
            $('.background1').css('opacity', 0);
            $('.background2').css('opacity', 0);
            $('.background3').css('opacity', 0);
            $('.background4').css('opacity', 0);
            $('.background5').css('opacity', 0);
            $('.background12').css('opacity', 1);
            $('.background13').css('opacity', 0);
            $('.background14').css('opacity', 0);
            $('.background15').css('opacity', 0);
            $('.background6').css('opacity', 0);
            $('.colorPick').css('opacity',0);
            $('canvas').css('opacity', 0);
            audioElement.pause();
        }     
        else if(data.evtName == 'theme_13'){
            $('.background1').css('opacity', 0);
            $('.background2').css('opacity', 0);
            $('.background3').css('opacity', 0);
            $('.background4').css('opacity', 0);
            $('.background5').css('opacity', 0);
            $('.background12').css('opacity', 0);
            $('.background13').css('opacity', 1);
            $('.background14').css('opacity', 0);
            $('.background15').css('opacity', 0);
            $('.background6').css('opacity', 0);
            $('.colorPick').css('opacity',0);
            $('canvas').css('opacity', 0);
            audioElement.pause();
        }     
        else if(data.evtName == 'theme_14'){
            $('.background1').css('opacity', 0);
            $('.background2').css('opacity', 0);
            $('.background3').css('opacity', 0);
            $('.background4').css('opacity', 0);
            $('.background5').css('opacity', 0);
            $('.background12').css('opacity', 0);
            $('.background13').css('opacity', 0);
            $('.background14').css('opacity', 1);
            $('.background15').css('opacity', 0);
            $('.background6').css('opacity', 0);
            $('.colorPick').css('opacity',0);
            $('canvas').css('opacity', 0);
            audioElement.pause();
        }     
        else if(data.evtName == 'theme_15'){
            $('.background1').css('opacity', 0);
            $('.background2').css('opacity', 0);
            $('.background3').css('opacity', 0);
            $('.background4').css('opacity', 0);
            $('.background5').css('opacity', 0);
            $('.background12').css('opacity', 0);
            $('.background13').css('opacity', 0);
            $('.background14').css('opacity', 0);
            $('.background15').css('opacity', 1);
            $('.background6').css('opacity', 0);
            $('.colorPick').css('opacity',0);
            $('canvas').css('opacity', 0);
            audioElement.pause();
        }         
        else if(data.evtName == 'theme_music1'|| data.evtName == 'theme_music2'||data.evtName == 'theme_music3'){
            playMusic(data.evtName);

            
        }
    }
    // if(data.target.toUpperCase() == 'CUBE084') {
    //     if(data.evtName == 'color') {
    //         $('.background1').css('background', data.color);
       
    //     }
    // }
});

function playMusic(data){
  audioElement.pause();
  $('.musicText').css('opacity', 1);
  $('.background1').css('opacity', 0);
  $('.background2').css('opacity', 0);
  $('.background3').css('opacity', 1);
  $('.background4').css('opacity', 0);
  $('.background5').css('opacity', 0);
  $('.background6').css('opacity', 0);
  $('.colorPick').css('opacity',0);
  $('canvas').css('opacity', 1);
  $('.introVideo').removeClass('show');
  
  if(data == 'theme_music1'){
      audioElement.src="../../shelf_res/music/music9.mp3";
      changeFile(3);
      audioElement.volume = 1;
      audioElement.play();
      $('.musicText').html('Jazz Foo Foo - Winter Play');
  }
  else if(data == 'theme_music2'){
    $('.musicText').html('Familiar - Agnes Obel');
      audioElement.src="../../shelf_res/music/music5.mp3";
      audioElement.volume = 0.65;
      changeFile(2);
      audioElement.play();
  }
}
socket.on('nfc75',function(){   
    if(!nfcFlag){
      nfcFlag = true;
      playMusic('theme_music1');
    }
});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMapEnabled = true;
renderer.localClippingEnabled = true;
document.getElementById( "canvas3D" )
  .appendChild( renderer.domElement );


// setFileLocation to defaults
// keys A-Z change files
// keys 0-9 change banks
// keys SHIFT 0-9 change sets

// files are stored in /art
// art/currentSet/currentBank/currentFile


// var topval = $('.colorPick').position().top;
// var leftval = $('.colorPick').position().left;
// var widthval = $('.colorPick').width();
// var heightval = $('.colorPick').height();
// console.log("t: " +topval+", l: "+leftval+", w: "+widthval+", h: "+heightval);
// function moveDiv(keyCode){
//   if(keyCode ==38){
//     topval -= 1;
//     $('.colorPick').css('top',topval);
//   }
//   else if(keyCode ==40)
//   {
//         topval += 1;
//     $('.colorPick').css('top',topval);
//   }
//     else if(keyCode ==37)
//   {
//         leftval -= 1;
//     $('.colorPick').css('left',leftval);
//   }
//     else if(keyCode ==39)
//   {
//         leftval += 1;
//     $('.colorPick').css('left',leftval);
//   }
//   else if(keyCode ==188){
//     //console.log("test");
//     widthval -= 1;
//     $('.colorPick').css('width',widthval);
//   }
//   else if(keyCode ==190)
//   {
//         widthval += 1;
//     $('.colorPick').css('width',widthval);
//   }
//     else if(keyCode ==191)
//   {
//         heightval -= 1;
//     $('.colorPick').css('height',heightval);
//   }
//     else if(keyCode ==186)
//   {
//         heightval += 1;
//     $('.colorPick').css('height',heightval);
//   }

// }
function setup() {
  changeFile(7);
}

// FILE LOADER FUNCTIONS

function changeFile( file ) {
  reset();
  current_file = file;
  var loc = current_set + '/' + current_bank + '/'+current_file;
  var filename = 'art/' + loc + '.js';
  loadJS( filename );
  document.location.hash = loc;
  console.log("File: " + loc);

}
function changeMode(mode){
  if(mode == 81){
      $('canvas').css('opacity', 1);
      $('.background1').css('opacity', 0);
  }
}

function changeSet( set ) {
  current_set = set;
  current_bank = 0;
  console.log( "changeSet: " + current_bank );
  // reset
  changeFile( 0 );
}


function changeBank( bank ) {
  current_bank = bank;
  console.log( "changeBank: " + current_bank );
  changeFile( 0 );
}

function reset(){
  ctx.clearRect( 0, 0, w, h );
  ctx2.clearRect( 0, 0, w, h );
  ctx3.clearRect( 0, 0, w, h );
  ctx.lineCap = "butt";
}
    
// INJECT JS ONTO PAGE
    // const playButton = document.querySelector('button');
    // playButton.addEventListener('click', function() {
      

    //   playButton.style.visibility = 'hidden';
    //   // play or pause track depending on state
    //   if (this.dataset.playing === 'false') {
    //       //audioElement.play();
    //       this.dataset.playing = 'true';
    //       reset();
    //   } else if (this.dataset.playing === 'true') {
    //       //audioElement.pause();
    //       this.dataset.playing = 'false';
    //   }

    // }, false);

function loadJS( filename ) {

  if ( fileref != undefined ) document.getElementsByTagName( "head" )[ 0 ].removeChild( fileref );
  fileref = document.createElement( 'script' );
  fileref.setAttribute( "type", "text/javascript" );
  fileref.setAttribute( "src", filename );
  document.getElementsByTagName( "head" )[ 0 ].appendChild( fileref );

}
