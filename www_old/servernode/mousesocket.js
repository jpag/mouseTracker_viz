/*
setTimer();

function updateTime(){
    console.log('------ node running');
	setTimer();
}

function setTimer(){
	setTimeout(updateTime,1000);
}
*/


var address = '192.168.1.11';

// --------WEBSOCKET SETUP
/*
var webPort = 8080;

var ws = require("websocket-server");
var webServer = ws.createServer();

webServer.addListener("connection", function(connection){
    
    //CONNECT = 1
    console.log('connection made '+connection.id.toString());
    //var colorPick = Math.floor(Math.random()*numberOfColors);
    connection.send("1"+","+connection.id.toString() );  //+ ','+colorPick
    
    connection.addListener("message", function(msg){
        webServer.broadcast("2"+","+connection.id.toString()+","+msg);
        console.log( 'message received ' );
        console.log( msg );
    });
    connection.addListener("close", function() {
        webServer.broadcast("0"+","+connection.id.toString());
        console.log('disconnected '+connection.id.toString());    
    });    
});
webServer.listen(webPort);
console.log('webServer running at '+address+':'+webPort+'');

*/

////-----TCP SETUP

var appPort = 1337
var bitmapObj = {};
var socket_list = [];

var net = require('net');

var server = net.createServer(function (socket) {
  socket_list.push(socket);
  console.log(' new connection - total =' + socket_list.length );
  
  //socket.write('Echo server'); // what's this do?
  socket.setEncoding('ascii');
  //socket.pipe(socket);  
  
  socket.on('data', function(data) {
     //console.log(' data recieved - ');
     console.log(data);
     //socket.write('GOT IT');     
     socket.write('message recieved' + data );
   });
  
  socket.on('end', function() {
      var i = socket_list.indexOf(socket);
      socket_list.splice(i, 1);
  });  
  
});

server.listen(appPort, address);
console.log('TCP running at http://'+address+':'+appPort+' ');









//TCP
/*
var tcp = require("net");
var server = net.createServer(function(socket){
	socket.write('server---- ' );
	socket.pipe(socket);
});

server.listen(8080);
*/

//var io = require('socket.io').listen(1337);
//io.sockets.on('connection', function (socket) {
//	console.log(' setup socket ' );x
//	socket.emit('news', { hello: 'world' });
//	socket.on('my other event', function (data) {
//    console.log(data);
//  });
//});









