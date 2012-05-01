//io listens for 1337, waiting for html
var address = '192.168.1.12';

var io = require('socket.io').listen(1337, address );
	io.set('log level', 1); // reduce logging
	
var net = require('net');
var fs = require('fs');
var apps_connected = [];
var app_index = 0;

var colors = ["bbd100" , "45d697" , "45c7d6" , "3d81ff" , "8f3dff" , "ff3def" , "f80767" , "ff3600" , "c6ff00" , "00ffde" ];
var defaultRadius = 1;
var maxRadius = 50;//50;
var defaultAlpha = 1;//1;
var minAlpha = 1;//25;
var maxAlpha = 150;

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
	connection.coords = [0,0];
	connection.r = defaultRadius;
	connection.alpha = defaultAlpha;
	
	
	trace( id + ' color picked ' + connection.color + ' ' + connection.alpha );
	
	apps_connected.push(connection);	  
	connection.write('Echo server\r\n');
	connection.setEncoding("ascii");
	
	connection.on('data', function(data) {
    	//trace(data);
	    //sending data via socket io, to HTML clients port 1337
	    var _r = defaultRadius;
	    var _a = defaultAlpha;
	    
	    var datasplit = data.split("," );
	    if( appClient.determineMinimalMovement(datasplit[0],connection.coords[0]) && 
	    	appClient.determineMinimalMovement(datasplit[1],connection.coords[1]) ){
	    	
	    	//enlarge radius.	
	    	_r = connection.r+((maxRadius-connection.r)*.0008) //r*1.01;
	    	//lower alpha
	    	_a = connection.alpha + ((maxAlpha-connection.alpha)*.0005);
	    	
	    }else{
	    	//_r = connection.r*.1;
	    }
	    
	    //check max / min values
	    if( _r > maxRadius ){
	    	_r = maxRadius;
	    }else if( _r < defaultRadius ){
	    	_r = defaultRadius;
	    }
	    	
	    if( _a < minAlpha ){
	    	_a = minAlpha;
	    }else if( _a > maxAlpha ){
	    	_a = maxAlpha;
	    }
	    
	    var _name = 'undefined';
	    if( datasplit.length > 3 ){
	    	//trace( datasplit );
	    	_name = datasplit[3];
	    }
	    
	    var _color = connection.color; //default for older apps.
	    if( datasplit.length > 4 ){
	    	_color = datasplit[4];
	    }
	    
	    //trace(' length of data object ' + datasplit.length )
	    
    	io.sockets.emit('appEvent', { coordinates:data , id: id , color:_color , radius:_r , alpha:_a , name:_name });
    	
    	//store previous content if needed on next update...
    	connection.coords = datasplit;
    	connection.r = _r;
    	connection.alpha = _a;
    	

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


var appClient = new Object();

	appClient.determineMinimalMovement = function(current,previous){

		var marginOfError = 5;
		var _dif = false;
		
		//if( ((previous-marginOfError)<current) && (current<(previous+marginOfError))  ){
		if( previous == current ){
			_dif = true; 
		}
		
		return _dif;
	}



function trace(str){try{console.log(str)}catch(e){};}