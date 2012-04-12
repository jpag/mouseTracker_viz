//io listens for 1337, waiting for html
var address = '192.168.1.11';

var io = require('socket.io').listen(1337, address );
var net = require('net');
var fs = require('fs');
var sockets_list = [];



//-----HTML clients
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


//-----APP clients
var server = net.createServer(function (socket) {
  sockets_list.push(socket);
  socket.write('Echo server\r\n');
  socket.setEncoding("ascii");
  socket.on('data', function(data) {
    console.log(data);
    //sending data via socket io, to port 1337
    io.sockets.emit('news', { hello: data });
  });

});

//server listens to 1338, waiting for data from app
server.listen(1338, address);
