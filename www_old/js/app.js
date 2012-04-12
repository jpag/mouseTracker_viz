var connection;

var events = {MOUSEMOVE:2 , CONNECT:1 , DISCONNECT:0 }

var c = new Object();

c.init = function(){
	//connect
	if ( window["WebSocket"] ) {	
		c.createConnection();
		
		$('body').click(function(){ c.clickTest(); });
		
	}else{
		//cant do this.
	}
}
c.port = '8080';//1337;
c.address = '192.168.1.11';
c.id = 0;

c.clickTest = function(){
	connection.send(' - clicked - ');
}

c.createConnection = function(){
	connection = new WebSocket("ws://"+c.address+":"+c.port+"/");
	
	connection.onopen = function( event ){
		console.log( ' -----open----' );
	}
	
	connection.onclose = function( event ) {
		connection.send('0');
		console.log( 'Disconnected :/' );
	}
	
	connection.onmessage = function( event ) {
	    trace( event );
	    var eventArray = event.data.split(',');
	   	console.log( eventArray );
	    
	    if( eventArray[0] == events.MOUSEMOVE ){
	    	trace(' event ' );
	    }else if( eventArray[0] == events.CONNECT ){
	    	c.id = eventArray[1]; //msg
	    	trace(' ID CREATED ' + c.id );	
	    }else if( eventArray[0] == events.DISCONNECT  ){
			removeFollower(event.data.split(',') )       	
	    }
	    
	}
}

c.removeFollower = function(ar){
	//console.log( ' remove follower ' );
	console.log( ar );
	$("#"+ar[1]).fadeOut(function(){ 
		$(this).remove();  
	})
}


$(window).resize(function(){ });

function trace(str){try{console.log(str)}catch(e){};}