var imagebox={
				'front': {'url': './images/articuno-gray.png', 'img': null},
				'back': {'url': './images/Articuno.png', 'img': null}
			}
var cvsdraw = { temp: null, draw: null};
var mouseDown = false;

function supportsCanvas() {
	return !!document.createElement('canvas').getContext;
}

function getEventCoords(ev){
	var touchev, coords={};
	var origev=ev.originalEvent;

	if (origev.changedTouches != undefined){
		touchev = origev.changedTouches[0];
		coords.pageX = touchev.pageX;
		coords.pageY = touchev.pageY;
	}else {
		coords.pageX = ev.pageX;
		coords.pageY = ev.pageY;
	}
	return coords;
}

function getLocalcoords(elem, coords){
	var ox=0, oy=0;

	while(elem != null){
		ox += elem.offsetLeft;
		oy += elem.offsetTop;
		elem = elem.offsetParent;
	}

	return { 'x': coords.pageX - ox, 'y': coords.pageY - oy};
}

function recompositeCanvases(){
	var canvas=document.getElementById('mycanvas'),
			tempctx= cvsdraw.temp.getContext('2d');
			mainctx=canvas.getContext('2d');

			cvsdraw.temp.width=cvsdraw.temp.width;

			tempctx.drawImage(cvsdraw.draw, 0, 0);

			tempctx.globalCompositeOperation = 'source-atop';
			tempctx.drawImage(imagebox.back.img, 0, 0);

			mainctx.drawImage(imagebox.front.img, 0, 0);

			mainctx.drawImage(cvsdraw.temp, 0, 0);
}


function scratchLine(canvas, x, y, fresh){
	var ctx = canvas.getContext('2d');
	ctx.lineWidth = 45;
	ctx.lineCap = ctx.lineJoin = 'round';
	ctx.strokeStyle = '#fff';
	if (fresh){
		ctx.beginPath();
		ctx.moveTo(x+0.01, y);
	}
	ctx.lineTo(x, y);
	ctx.stroke();
}

function initialImage(){
	var canvas=document.getElementById('mycanvas');

	canvas.width= imagebox.back.img.width;
	canvas.height= imagebox.back.img.height;

	cvsdraw.temp= document.createElement('canvas');
	cvsdraw.draw=document.createElement('canvas');

	cvsdraw.temp.width=cvsdraw.draw.width=canvas.width;
	cvsdraw.temp.height=cvsdraw.draw.height=canvas.height;

	recompositeCanvases();

	function drawstart_handler(e){
		var local = getLocalcoords(canvas, getEventCoords(e));
		mouseDown=true;

		scratchLine(cvsdraw.draw, local.x, local.y, true);
		recompositeCanvases();

		return false;

	}

	function drawmove_handler(e) {
		if (!mouseDown) { return true; }

		var local = getLocalcoords(canvas, getEventCoords(e));

		scratchLine(cvsdraw.draw, local.x, local.y, false);
		recompositeCanvases();

		return false;
	};

	function drawdone_handler(e) {
		if (mouseDown) {
			mouseDown = false;
			return false;
		}

		return true;
	};


	$('#mycanvas').on('mousedown', drawstart_handler).on('touchstart', drawstart_handler);
	$(document).on('mousemove', drawmove_handler).on('touchmove', drawmove_handler);
	$(document).on('mouseup', drawdone_handler).on('touchend', drawdone_handler);
}

function loadingComplete() {
	$('#loading').hide();
	$('#main').show();
}

function setupImage(){
	var loads=0,
			total=0;
	
	var imageLoaded=function(){
		loads++;

		if(loads >= total){
			initialImage();
			loadingComplete();
		}
	}

	for (k in imagebox) if(imagebox.hasOwnProperty(k)) total++;
	for (k in imagebox) if(imagebox.hasOwnProperty(k)){
		imagebox[k].img=document.createElement('img');
		imagebox[k].img.onload=imageLoaded;
		imagebox[k].img.src=imagebox[k].url;
	}
}

(function(){

	if(supportsCanvas()) {
		setupImage();
	}	else $('#lamebrowser').show();

})()