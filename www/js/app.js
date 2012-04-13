var socket


var listOfFollowers = [];
var heightOfFollower = 48;
var widthOfFollower = 48;



var c = new Object();

c.port = '1337';
c.address = '192.168.1.11';
c.id = 0;

c.init = function(){
	
	$.getScript("http://"+c.address+":"+c.port+"/socket.io/socket.io.js" , c.socketScriptComplete );
	
}
c.socketScriptComplete = function(){

	//create socket	
	socket = io.connect('http://'+c.address+':'+c.port);
	socket.on('appEvent', function (data) {
	  //trace( data );
	  
	  var followerFound = false;
	  for( var i = 0; i < listOfFollowers.length; i++){
	  		if( data.id == listOfFollowers[i].id ){
	  			followerFound = true;
	  			break;
	  		} 
	  }
	  	
	  if( followerFound == false ){
	  //new follower create one!
	  		c.setupFollower( data );
	  }else{
	  	//follower already exists
	  		c.updateFollower(data);
	  }
	  //socket.emit('htmlCallback', { my: 'data' });
	});
		
}

c.updateFollower = function(data){

	var coords = data.coordinates.split("," );
	trace('id ' + data.id + ' ' + coords[0] +' - ' + coords[1] );
	//var divid = "f"+data.id.toString();
	//trace( divid );
	//trace( $(divid) );
	
	$( "#f"+data.id ).css({ left:coords[0]+"px", top:coords[1] });
	
}

c.setupFollower = function(data){
	var colorVal = data.color;
	var id_val = data.id;
	
	trace(' CREATED ' + id_val + ' ----- colorVal: ' + colorVal );
	$("#followerContainer").append("<div id='f"+id_val+"' class='follow' style='background-color:"+colorVal+"' ></div>" );
	c.updateFollower(data);
	trace(data );
	trace(' /n-----');
	listOfFollowers.push({id:id_val , color:colorVal});
};





$(window).resize(function(){ });
function trace(str){try{console.log(str)}catch(e){};}