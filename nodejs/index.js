const express = require('express');
const http = require('http');
const path = require('path');
const serveIndex = require('serve-index');
const cors = require('cors');
const HOME_DIR = path.join(__dirname, '..');

// Create Web Server and attach services and features middleware
var app = express();
app.use(express.static(HOME_DIR));
app.use(serveIndex(HOME_DIR));
var httpServer = http.createServer(app).listen('8000', function (req, res) {
    console.log('HTTP Server has been started on port 8000');
});
app.use(cors({origin:"*", methods: ['ALL']}));

var io = require('socket.io').listen(httpServer);

var sockets = {};
function emitOnNamedSocket(name, evtType, data) {
    if(name && sockets[name]) {
        console.log(`Emitting ${evtType} event on ${sockets[name].length} "${name}" socket(s)`);
        for(var i=0; i<sockets[name].length; i++) {
            sockets[name][i].emit(evtType, data);
        }
    }
}
io.sockets.on('connection', function (socket) {
    console.log('a client connected to socket.io server Id= ' + socket.id);

    socket.on('identify', function (data) {
        console.log(`identify: ${JSON.stringify(data)}`);
        if(data.name) {
            socket.name = data.name;
            sockets[data.name] = sockets[data.name] || [];
            sockets[data.name].push(socket);
        }
    });
    socket.on('disconnect', function () {
        console.log('Disconnect');
        if(socket.name && sockets[socket.name]) {
            var namedSockets = sockets[socket.name];
            for(var i=namedSockets.length-1; i>=0; i--) {
                if(namedSockets[i].id === socket.id) {
                    namedSockets.splice(i, 1);
                }
            }
        }
    });
    socket.on('notifyMsg', function (data) {
        console.log('notifyMsg: ' + JSON.stringify(data, null, 2));
        emitOnNamedSocket('view', 'notification', data);
    });
    socket.on('charging', function (data) {
        console.log('charging: ' + JSON.stringify(data, null, 2));
        emitOnNamedSocket('view', 'charging', data);
    });
});
