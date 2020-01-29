// Socket.IO Connection & Handling
var socket = io.connect(location.origin, {reconnect: true});

socket.on('connect', function () {
    console.log("Connected!");
    socket.emit('nfc75');
});
socket.on('appMsg',function(data){
});
