
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, user-scalable=no">

<style>

body {
	font-family: Helvetica, Arial, san-serif;
	font-size: 100%;
	margin: 0; padding: 0;
	color: #fff;
	background-color: #000;
}

#container {
	
}

.controller {
	display:none;
}
.controller.active {
	display: block;
}

.box {
	float: left;
	width: 33%;
	height: 1em;
	line-height: 1em;
	padding: 0.9em 0;
	background-color: #ff0;
	color: #000;
	text-align: center;
	opacity: 0.5;
	font-size: 1.8em;

}
.box.active {
	opacity: 1;
}

#controllerP .output {
	background-color: #000;
	color: #fff;
	min-height: 1em;
	line-height: 1em;
	padding: 0.9em 0;
	font-size: 1.8em;
	text-align: center;
}






.controlBox {
	position: relative;
	float: left;
	width: 50%;
	height: 300px;
	line-height: 1em;
	padding: 0;
}
#speed {
	margin-right: -4px;
	border-right: 4px solid #0cf;
}
.middleMarker,
#speed .touchMarker {
	display: block;
	position: absolute;
	top: 49%;
	left: 0;
	width: 100%;
	height: 0;
	border-top: 1px solid #0cf;
}
#speed .touchMarker {
	top: 25px;
	border-top: 3px solid #fff;

}
.centerMarker,
#direction .touchMarker {
	display: block;
	position: absolute;
	top: 0;
	left: 50%;
	width: 0;
	height: 100%;
	border-left: 1px solid #0cf;
}
#direction .touchMarker {
	left: 25px;
	border-left: 3px solid #fff;
}

#controllerL .output {
	position: absolute;
	top: 0;
	left: 50%;
	width: 4em;
	margin-left: -2em;
	background-color: #000;
	color: #fff;
	min-height: 1em;
	line-height: 1em;
	padding: 0.9em 0;
	font-size: 1.8em;
	text-align: center;

	border-right: 1px solid #0cf;
	border-bottom: 1px solid #0cf;
	border-left: 1px solid #0cf;
}





</style>

</head>
<body>
<div id="container" class="container">

	<div id="controllerP" class="controller">

		<div class="output"></div>

		<div class="box" data-text="<++"><++</div>
		<div class="box" data-text="++">++</div>
		<div class="box" data-text="++>">++></div>

		<div class="box" data-text="<+"><+</div>
		<div class="box" data-text="+">+</div>
		<div class="box" data-text="+>">+></div>

		<div class="box" data-text="<-"><-</div>
		<div class="box" data-text="-">-</div>
		<div class="box" data-text="->">-></div>

		<div class="box" data-text="<&plusmn;"><&plusmn;</div>
		<div class="box" data-text="&plusmn;">&plusmn;</div>
		<div class="box" data-text="&plusmn;>">&plusmn;></div>

	</div>

	<div id="controllerL" class="controller">

		<div id="speed" class="controlBox">
			<span class="middleMarker"></span>
		</div>
		<div id="direction" class="controlBox">
			<span class="centerMarker"></span>
		</div>

		<div class="output"></div>

	</div>


</div>

<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script>

/*

Requires jQuery


*/


var printText = function(text){

	var t = text || '';
	$('.output').text(t);

};


var findTarget = function(x,y, $els){

	var $target = null;

	$els.each( function(){

		var $el = $(this);

		var x1 = $el.offset().left;
		var y1 = $el.offset().top;
		var x2 = x1 + $el.outerWidth();
		var y2 = y1 + $el.outerHeight();


		if( x > x1 && x < x2 && y > y1 && y < y2 ){
			$target = $el;
		}

	});

	return $target;

};


(function setTouchEvents(){

	var touch,
		startX = 0,
		nowX = 0,
		endX = 0,
		diffX = 0;

	var onTouchEnd = function(e) {
			var touch = e.pageX ? e : e.touches[0];
		    e.preventDefault();

		    document.removeEventListener('touchmove', onTouchMove);                        
            document.removeEventListener('touchend', onTouchEnd);

	};

	var onTouchMove = function(e) {
		e.preventDefault();

		var touch = e.pageX ? e : e.touches[0];
		var $target = findTarget( touch.pageX, touch.pageY, $('.box') );

		if($target){
			$target.trigger('customtouchover');
		}

	};

	var onTouchStart = function(e) {
		
		e.preventDefault();

		var touch = e.pageX ? e : e.touches[0];
		var $target = findTarget( touch.pageX, touch.pageY, $('.box') );

		if($target){
			$target.trigger('customtouchover');
		}

		document.addEventListener('touchmove', onTouchMove);
		document.addEventListener('touchend', onTouchEnd);

	};

	document.addEventListener('touchstart', onTouchStart);

})();

function setEventListeners(){

	$('.box').each( function(){
		$(this).on('customtouchover', function(e){
			$('.box').removeClass('active');
			$(this).addClass('active');

			var command = $(this).data('text');

			printText(command);

		});
	});

	document.addEventListener('touchend', function(){
		$('.box').removeClass('active');
		printText();
	});


}

///////



var updateCommand = (function(){

	var x = 0, y = 0;

	return function(newX,newY){

		var xMin = $('#direction').offset().left;
		var xMax = $('#direction').offset().left + $('#direction').width();
		var yMin = $('#speed').offset().top;
		var yMax = $('#speed').offset().top + $('#direction').height();

		var xRange = xMax - xMin;
		var yRange = yMax - yMin;

		if(newX === 'center'){
			x = 0;
		}

		if(newY === 'center'){
			y = 0;
		}

		if(typeof newX === "number"){
			var xInRange = newX - xMin;
			var xPercent = xInRange / xRange;
			x = xPercent * 2 - 1;
		}

		if(typeof newY === "number"){
			var yInRange = newY - yMin;
			var yPercent = yInRange / yRange;
			y = yPercent * 2 - 1;
			y = y * -1;
		}

		if(x < -1){ x = -1 };
		if(x > 1){ x = 1 };
		if(y < -1){ y = -1 };
		if(y > 1){ y = 1 };

		return {
			x: Math.round(x*100)/100,
			y: Math.round(y*100)/100
		}

	}

})();



// Finds the array index of a touch in the currentTouches array.
var findCurrentTouchIndex = function (id) {
    for (var i=0; i < currentTouches.length; i++) {
        if (currentTouches[i].id === id) {
            return i;
        }
    }

    // Touch not found! Return -1.
    return -1;
};

var currentTouches = [];


var updateTouchMarker = function(id, x, y){

	$el = $('#'+id);

	if(x && $el.parent().attr('id') === 'direction'){
		$el.css({
			left: x - $('#direction').offset().left + 'px'
		});
	}
	if(y && $el.parent().attr('id') === 'speed'){
		$el.css({
			top: y - $('#speed').offset().top + 'px'
		});
	}

};


var addTouchMarker = function($el, newId, x, y){

	$output = $('<span class="touchMarker"></span>' ).attr('id', newId);

	if(x){
		$output.css({
			left: x - $('#direction').offset().left + 'px'
		});
	}
	if(y){
		$output.css({
			top: y - $('#speed').offset().top + 'px'
		});
	}

	$el.append($output);

};

var removeTouchMarker = function(id){

	$('#'+id).remove();

};


(function setTouchEvents(){

	var touch,
		startX = 0,
		nowX = 0,
		endX = 0,
		diffX = 0;

	var onTouchEnd = function(e) {
		var touches = event.changedTouches;

	    for (var i=0; i < touches.length; i++) {
	        var touch = touches[i];
	        var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

	        if (currentTouchIndex >= 0) {
	            var currentTouch = currentTouches[currentTouchIndex];

	            removeTouchMarker('touch'+touch.identifier);

	            if($(touch.target).attr('id') === 'direction'){
	            	updateCommand('center',null);
	            }

	            if($(touch.target).attr('id') === 'speed'){
	            	updateCommand(null,'center');
	            }

	            // Remove the record.
	            currentTouches.splice(currentTouchIndex, 1);
	        } else {
	//            console.log('Touch was not found!');
	        }

	    }

			
	};

	var onTouchMove = function(e) {
		var touches = event.changedTouches;
		var xy;

	    for (var i=0; i < touches.length; i++) {

			var touch = touches[i];
	        var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

	        if (currentTouchIndex >= 0) {
	            var currentTouch = currentTouches[currentTouchIndex];

	            if(currentTouch.parentId === "speed"){
		            updateTouchMarker('touch'+touch.identifier, null, touch.pageY);
		            xy = updateCommand(null, touch.pageY);
					printText(xy.x+" "+xy.y);
		        }

		        if(currentTouch.parentId === "direction"){
		            updateTouchMarker('touch'+touch.identifier, touch.pageX, null);
		            xy = updateCommand(touch.pageX, null);
					printText(xy.x+" "+xy.y);
		        }

	            // Update the touch record.
	            currentTouch.pageX = touch.pageX;
	            currentTouch.pageY = touch.pageY;

	            // Store the record.
	            currentTouches.splice(currentTouchIndex, 1, currentTouch);
	        } else {
	    //        console.log('Touch was not found!');
	        }
		}


	};

	var onTouchStart = function(e) {
		
		e.preventDefault();

		var touches = event.changedTouches;

		for (var i=0; i < touches.length; i++) {

	        var touch = touches[i];
	        var xy;

	        var $box = findTarget(touch.pageX, touch.pageY, $('#speed, #direction'));

	        if($box){

		        currentTouches.push({
		            id: touch.identifier,
		            pageX: touch.pageX,
		            pageY: touch.pageY,
		            parentId: $box.attr('id')
		        });

		        if($box.attr('id') === "speed"){
		        	addTouchMarker( $box, 'touch'+touch.identifier, null, touch.pageY);
					xy = updateCommand(null, touch.pageY);
					printText(xy.x+" "+xy.y);
				}

		        if($box.attr('id') === "direction"){
		        	addTouchMarker( $box, 'touch'+touch.identifier, touch.pageX, null);
		        	xy = updateCommand(touch.pageX, null);
		        	printText(xy.x+" "+xy.y);
		        }

		    }

	    }

		

	};

	document.addEventListener('touchstart', onTouchStart);
	document.addEventListener('touchmove', onTouchMove);
	document.addEventListener('touchend', onTouchEnd);

})();





///////




function setActiveController(){

	$('.controller').removeClass('active');

	if($(window).width() < $(window).height()){
		$('#controllerP').addClass('active');
	} else {
		$('#controllerL').addClass('active');
	}

}


function init(){

	setActiveController();
	setEventListeners();

	$(window).on('resize', setActiveController);

}

init();



//This prevents iPhone scrolling - it's assigned to the body?
//I don't think I need it with my current code example
document.body.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, false); 


</script>
</body>
