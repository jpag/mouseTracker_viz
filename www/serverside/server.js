//io listens for 1337, waiting for html
var address = '192.168.1.12';

var io = require('socket.io').listen(1337, address );
	io.set('log level', 1); // reduce logging
	
var net = require('net');
var fs = require('fs');
var apps_connected = [];
var app_index = 0;

var colors = ["#bbd100" , "#45d697" , "#45c7d6" , "#3d81ff" , "#8f3dff" , "#ff3def" , "#f80767" , "#ff3600" , "#c6ff00" , "#00ffde" ];

//-----HTML clients
io.sockets.on('connection', function (socket) {
	trace(' html client connected ' );
	
  socket.emit('data', { event: 'connect' });
  socket.on('htmlCallback', function (data) {
    //trace(data);
  });
  socket.on('disconnect', function(){
     trace(' HTML client disconnected ' );
  });
});


//-----APP clients
var serverclient = net.createServer(function (connection) {
	app_index++;
	var id = app_index;
  	
	connection.id = id;
	
	//var cid = Math.round( Math.random()*colors.length );
	//if( cid > (colors.length-1) ){ cid = 0; };
	var cid = app_index;
	if( app_index >= colors.length ){
		cid = Math.round(app_index/colors.length)-1;
	}
	
	connection.color = colors[ cid ];
	
	trace( id + ' color picked ' + connection.color );
	
	apps_connected.push(connection);	  
	connection.write('Echo server\r\n');
	connection.setEncoding("ascii");
	
	connection.on('data', function(data) {
    	//trace(data);
	    //sending data via socket io, to HTML clients port 1337
    	io.sockets.emit('appEvent', { coordinates:data , id: id , color:connection.color });
	});
	
	connection.on('end', function(data) {
		for(var s=0; s < apps_connected.length ; s++ ){
			if( apps_connected[s] == connection ){
				apps_connected.splice(s,1);
				trace( '   ---- found app connection from list and disconnected/removed');
				io.sockets.emit('appDisconnect' , { id:connection.id  });
				break;
			}
		}
	});

});

//server listens to 1338, waiting for data from app
serverclient.listen(1338, address );


function trace(str){try{console.log(str)}catch(e){};}