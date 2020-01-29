

function onKeyDown(event) {

		console.log(event.keyCode);
    var keyCode = event.keyCode;

    // CHANGE FILE // keys a-z
    if (keyCode >= 65 && keyCode <= 90) {
      //changeFile(keyCode - 65);
      changeMode(keyCode);

      // CHANGE SET AND BANK // keys 0-9
    } else if (keyCode >= 48 && keyCode <= 57) {

			if(event.shiftKey) {
	      changeSet(keyCode-48);
			} else {
				changeFile(keyCode-48);
			}

      // ~ SHOW MOUSE
    } else if (keyCode == 192) {
      showMouse();
    }
   // else if(keyCode ==38 || keyCode == 40 ||keyCode == 37||keyCode == 39){
   //   moveDiv(keyCode);
   // }
   // if(keyCode ==188 || keyCode == 190 ||keyCode == 191||keyCode == 186){
   //   moveDiv(keyCode);
   // }

}

window.addEventListener('keydown', function(e) {
    if (typeof onKeyDown == 'function') onKeyDown(e);
  });
