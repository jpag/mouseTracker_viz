var socket

var c = new Object();

c.port = '1338';
c.address = '24.103.78.238';
c.id = 0;

c.init = function(){
	
	//create socket	
	socket = io.connect('http://'+c.address+':'+c.port);
	socket.on('news', function (data) {
	  trace(data);
	  socket.emit('my other event', { my: 'data' });
	});
		
}


$(window).resize(function(){ });
function trace(str){try{console.log(str)}catch(e){};}