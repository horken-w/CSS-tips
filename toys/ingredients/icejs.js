var canvas;
var ctx;
var _startX, _startY, _offsetX, _offsetY, _dragElement;
var bgimg = new Image();
bgimg.src = 'ingredients/images/icebow.svg';
var hasTouch = 'ontouchstart' in document;

function addEvent(obj, evt, fn) {
  if (obj.addEventListener)
    obj.addEventListener(evt, fn, false);
  else if (obj.attachEvent)
    obj.attachEvent('on' + evt, fn);
}

function dragEvent() { // mouse drag & touch drag
  var canvas=document.getElementById('mycv');

  var extractNumber= function(num){
   	var n=parseInt(num);
   	return n==null || isNaN(n)? 0: n;
	}
  var onMoveEvent=function(e){
  	if(e==null) var e=window.event;
    if(!e.touches){
      _dragElement.style.left=(_offsetX+e.clientX-_startX)+'px';
      _dragElement.style.top=(_offsetY+e.clientY-_startY)+'px';
    }else if(e.target.classList[0] == 'drag'){
      e.preventDefault();
      _dragElement.style.left=(_offsetX+e.touches[0].clientX-_startX)+'px';
      _dragElement.style.top=(_offsetY+e.touches[0].clientY-_startY)+'px';
    }
  }
  var onStartEvent=function(e){
  	e.touches == null ? e: e=e.touches[0];
  	var _target=e.target != null ? e.target: e.srcElement;
  	if(e!=null && _target.classList[0] == 'drag'){
  		_startX=e.clientX;
  		_startY=e.clientY;

  		_offsetX=extractNumber(_target.style.left);
  		_offsetY=extractNumber(_target.style.top);

  		_dragElement= _target;
      if(!hasTouch)	document.onmousemove=onMoveEvent;
		  document.body.focus();
		  return false;
  	}
  }
  var onStopEvent=function(){
  	if(_dragElement != null || _dragElement != undefined){
		  document.onmousemove=null;
		  document.onselectstart=null;
		 	_dragElement.ondragstart=null;
		 	_dragElement=null;
		}
  }
  if(hasTouch){
    canvas.addEventListener('touchstart', onStartEvent, false);
    document.addEventListener('touchmove', onMoveEvent, false);
    document.addEventListener('touchend', onStopEvent, false);
    document.addEventListener('touchcancel', onStopEvent, false);
  }
  canvas.onmousedown=onStartEvent;
  document.addEventListener('mouseup', onStopEvent, false);
}
function cloneItems(e) {
  var _target = e.target;
  var imgTag = function(src, alt) {
    var _img = document.createElement('img');
  	_img.setAttribute('alt', alt);
    _img.setAttribute('src', src);
    _img.style.left=500+'px';
    _img.style.top=200+'px';

    return _img
	}
	var comp = imgTag(_target.src, _target.alt),
  local = document.getElementById('mypaper');
	comp.className = 'drag';
	local.parentNode.insertBefore(comp, local);
}
function imageSetting(){
	var imgitems=document.getElementsByClassName('drag'),
			canv=document.getElementById('mypaper'),
			objlen=imgitems.length;
			
	var Imagesdraw = function(obj){
		ctx.drawImage(obj.obj, obj.x, obj.y);
	}
	while (imgitems[0] != undefined){
		var imgobj={};
		imgobj.x=imgitems[0].offsetLeft-canv.offsetLeft;
		imgobj.y=imgitems[0].offsetTop-canv.offsetTop;
		imgobj.obj=imgitems[0];
		Imagesdraw(imgobj);
		imgobj.obj.parentNode.removeChild(imgobj.obj);
	}
  open();
}
function initCanvas() {
  var listitems = document.getElementById('ingredients').children;
  canvas = document.getElementById("mypaper");
  ctx = canvas.getContext("2d");
  ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
  for (var i = 0; i < listitems.length; i++) {
    hasTouch
      ? addEvent(listitems[i], 'touchstart', cloneItems)
      : addEvent(listitems[i], 'click', cloneItems);
  }
	dragEvent();
  addEvent(document.getElementById('draw'), 'tuchstart', imageSetting) 
  addEvent(document.getElementById('draw'), 'click', imageSetting);
}

function open() {
  var dataURL = canvas.toDataURL('image/png');
  document.getElementById('canvasImg').src = dataURL;
}
addEvent(window, 'load', initCanvas);
