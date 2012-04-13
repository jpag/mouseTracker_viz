//io listens for 1337, waiting for html
var address = '192.168.1.11';

var io = require('socket.io').listen(1337, address );
var net = require('net');
var fs = require('fs');
var sockets_list = [];


var colors = ["#bbd100" , "#45d697" , "#45c7d6" , "#3d81ff" , "#8f3dff" , "#ff3def" , "#f80767" , "#ff3600" , "#c6ff00" , "#00ffde" ];


//-----HTML clients
io.sockets.on('connection', function (socket) {
  socket.emit('data', { event: 'connect' });
  socket.on('htmlCallback', function (data) {
    console.log(data);
  });
});


//-----APP clients
var server = net.createServer(function (socket) {
	var id = sockets_list.length+1;
  	
	socket.id = id;
	var cid = Math.round( Math.random()*colors.length );
	if( cid > (colors.length-1) ){ cid = 0; };
	socket.color = colors[ cid ];
	
	console.log( id + ' color picked ' + socket.color );
	
	sockets_list.push(socket);	  
	socket.write('Echo server\r\n');
	socket.setEncoding("ascii");
	
	socket.on('data', function(data) {
    	//console.log(data);
	    //sending data via socket io, to port 1337
    	io.sockets.emit('appEvent', { coordinates:data , id: id , color:socket.color });
	});

});

//server listens to 1338, waiting for data from app
server.listen(1338, address);
