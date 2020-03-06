var express = require('express');
var http = require('http');
var serveIndex = require('serve-index');
var path = require('path');
const readline = require('readline');

var homeDir = path.join(__dirname, '../..');
var app = express();
app.use(express.static(homeDir));
app.use(serveIndex(homeDir));
var app2 = express();
app2.use(express.static(homeDir));
app2.use(serveIndex(homeDir));

var httpServer = http.createServer(app).listen(8080, function (req, res) {
	log('Socket IO Server has been started...');
});

var MAX_DELAY = 0;
var socketNameMap = {};
var activatedDevice = null;
var io = require('socket.io').listen(httpServer);
io.sockets.on('connection', function (socket) {
	console.log('connection ' + socket.id);
	
	socket.on('appMsg', function (data) {
		log("[APP MESSAGE] " + JSON.stringify(data));
		emitToAll('appMsg', data);
		if(data && data.evtName == 'sync') {
			prepareSync();
		}
	});
	socket.on('disconnect', function () {
		if(socket.name) {
			delete socketNameMap[socket.name];
			deactivate(socket.name);
		}
	});
	socket.on('identify', function (id, subscriptions) {
		socketNameMap[(id+'').toLowerCase()] = socket;
		socket.name = id;
		socket.subscriptions = subscriptions || null;
		activate(id);
	});

	socket.on('nfc55',function(){
	    console.log('nfc1');
	    io && io.sockets.emit('nfc55');
	  
	});
	socket.on('nfc75',function(){
	    console.log('nfc2');
	    io && io.sockets.emit('nfc75');
	  
	});
});

function prepareSync() {
	MAX_DELAY = 0;
	for(var name in socketNameMap) {
		var hostSocket = socketNameMap[name] || null;
		log("request Time to " + name);
		hostSocket && hostSocket.emit('requestTime');
	}
}
function activate(deviceName) {
	activatedDevice = socketNameMap[(deviceName+'').toLowerCase()] || null;;
	log('activated (' + (activatedDevice ? activatedDevice.name : null) + ')');
	activatedDevice && activatedDevice.emit('activated');
}
function deactivate(socketName) {
	log('deactivate ('+(socketName)+')');
	if(activatedDevice && activatedDevice.name === socketName) {
		activatedDevice = null;
		for(var name in socketNameMap) {
			if(!activatedDevice) {
				activatedDevice = socketNameMap[name];
			}
		}
	}
}

function emitToAll(eventName, eventData) {
	io && io.sockets.emit(eventName, eventData);
}
function log (msg) {
	console.log('[' + Date.now() + '] ' + msg);
}
