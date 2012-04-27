var socket


var listOfFollowers = [];
var heightOfFollower = 20;
var widthOfFollower = 20;

var canvasW = 1920;
var canvasH = 1080;

var increment = 0;

var canvas = new Object();
	canvas.w = 1920;
	canvas.h = 1080;
	canvas.r = 1;
	canvas.ctx;
	canvas.init = function(){
		canvas.w = canvasW;
		canvas.h = canvasH;
		
		$('#visualizeContainer').append('<canvas id="canvas-draw" width="'+canvas.w+'" height="'+canvas.h+'"></canvas>');
		//get a reference to the canvas
		canvas.ctx = $('#canvas-draw')[0].getContext("2d");
		
		canvas.fadePreviousData();
	}

	canvas.lighten = function(col,amt) {
//	    var num = parseInt(col,16);
//	    var r = (num >> 16) + amt;
//	    var b = ((num >> 8) & 0x00FF) + amt;
//	    var g = (num & 0x0000FF) + amt;
//	    var newColor = g | (b << 8) | (r << 16);
//	    
//	    return newColor.toString(16);
		
		col[0] += parseInt(amt);
		col[1] += parseInt(amt);
		col[2] += parseInt(amt);
		
		return col;
	}
	
	canvas.drawPoint = function(data){
		
		//canvas.ctx.globalAlpha = data.alpha;
		//trace( canvas.ctx.globalAlpha );
		
		var color = toRGB( data.color.toString() );
			//color = [ Math.round(Math.random()*250) , Math.round(Math.random()*250) , Math.round(Math.random()*250) ];
		//var colorval = 'rgba('+canvas.lighten(color[0],data.alpha)+','+canvas.lighten(color[1],data.alpha)+','+canvas.lighten(color[2],data.alpha)+',1)';
		
		//var colorval = '#'+canvas.lighten( data.color , data.alpha );
		var colorLight = canvas.lighten(color , data.alpha);
		
		var colorval = 'rgb('+colorLight[0]+','+colorLight[1]+','+colorLight[2]+');';
		
			//colorval = 'rgba(187,209,0,.001)';
			//colorval = '#'+data.color.toString();
		
		
		if( increment > 2000 && increment < 2100 ){
			//trace( data.color.toString() );
			trace( data.alpha  );
			//trace( color );
			trace( colorval );
			trace( ' ---- ' );
			
		}
		
		increment++;

		
		canvas.ctx.fillStyle = colorval;//"#"+data.color;
		canvas.ctx.beginPath();
		canvas.ctx.arc(data.x, data.y, data.radius, 0, Math.PI*2, true); 
		canvas.ctx.closePath();
		canvas.ctx.fill();
		
		//canvas.ctx.globalAlpha = 1;
	}
	
	canvas.fadePreviousData = function(){
		//http://beej.us/blog/data/html5s-canvas-2-pixel/
		//http://jsfiddle.net/Gtvv6/
		
		trace(' fade previous ... ' );
		
		// get all canvas pixel data
		//var imageData = canvas.ctx.getImageData(0, 0, canvas.w, canvas.h);
		
		var tempCanvas = document.createElement('canvas');
		//no need to delete this it is in the reference
		  tempCanvas.height = canvas.h;
		  tempCanvas.width = canvas.w;
		
		var tempCanvasCTX = tempCanvas.getContext('2d');
		tempCanvasCTX.drawImage($('#canvas-draw')[0] ,0,0);
		
		//clear visible canvas
		canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
		
		canvas.ctx.globalAlpha = .99;
		// put pixel data on canvas
		//canvas.ctx.putImageData(tempCanvasCTX, 0, 0);
		canvas.ctx.drawImage(tempCanvas,0,0);
		canvas.ctx.globalAlpha = 1;

		setTimeout('canvas.fadePreviousData()' , 2000 );
		
		
	}

var c = new Object();

c.port = '1337';
c.address = '192.168.1.12';
c.id = 0;

c.init = function(){
	$.getScript("http://"+c.address+":"+c.port+"/socket.io/socket.io.js" , c.socketScriptComplete );
	canvas.init();
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
		
	socket.on('appDisconnect' , function(data){
		c.removeFollower(data);
	});	
}

c.updateFollower = function(data){

	var coords = data.coordinates.split("," );

	var _y = parseInt(coords[1]);
	var _x = parseInt(coords[0]);
	var _r = data.radius;
	var _a = data.alpha;
	
	canvas.drawPoint({
						color:data.color, 
						x:_x, 
						y:_y,
						radius:_r,
						alpha:_a,
					});
	
	
	_x -= heightOfFollower * .5;
	_y -= widthOfFollower *  .5;
	$( "#f"+data.id ).css({ left:_x, top:_y });
	if( data.name != 'undefined' ){
		$( "#f"+data.id+" .name").html(data.name);
	}
	
}

c.setupFollower = function(data){
	var colorVal = "#"+data.color;
	var id_val = data.id;
	
	trace(' CREATED ' + id_val + ' ----- colorVal: ' + colorVal );
	$("#followerContainer").append("<div id='f"+id_val+"' class='follow'><div class='followIcon' style='background-color:"+colorVal+"' ></div><div class='name'></div></div>" );
	c.updateFollower(data);
	
	var color = toRGB(colorVal);
	trace(color);
	
	
	trace(data );
	trace(' /n-----');
	listOfFollowers.push({id:id_val , color:colorVal});
};

c.removeFollower = function(data){
	
	$("#f"+data.id).remove();
	
	for( var f=0; f < listOfFollowers.length; f++ ){
		if( data.id == listOfFollowers[f].id ){
			listOfFollowers.splice(f,1);
			trace(' ---- successfully removed follower');
		}
	}
	
	
};


$(window).resize(function(){ });
function trace(str){try{console.log(str)}catch(e){};}


//https://github.com/daniellmb/HEX-RGB-Conversion
(function(a){a["toRGB"]=function(a){var b=parseInt(a,16);return[b>>16,b>>8&255,b&255]};a["toHex"]=function(a,b,c){return(c|b<<8|a<<16|1<<24).toString(16).slice(1)}})(this);
