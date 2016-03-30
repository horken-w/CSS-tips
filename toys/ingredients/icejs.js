var canvas;
var ctx;
var width = 720;
var height = 645;
var _startX, _startY, _offsetX, _offsetY, _dragElement;
var bgimg = new Image();
bgimg.src = 'ingredients/icebow.svg';

function addEvent(obj, evt, fn) {
  if (obj.addEventListener)
    obj.addEventListener(evt, fn, false);
  else if (obj.attachEvent)
    obj.attachEvent('on' + evt, fn);
}

function dragEvent() {
  var canvas=document.getElementById('mycv');

  var extractNumber= function(num){
   	var n=parseInt(num);
   	return n==null || isNaN(n)? 0: n;
	}
  var mouseMove=function(e){
  	if(e==null) var e=window.event;

  	_dragElement.style.left=(_offsetY+e.clientX-_startX)+'px';
  	_dragElement.style.top=(_offsetX+e.clientY-_startY)+'px';
  }
  var dragStart=function(e){
  	e==null ? e=window.event: e;
  	var _target=e.target != null ? e.target: e.srcElement;
  	
  	if(e!=null && _target.classList[0] == 'drag'){
  		_startX=e.clientX;
  		_startY=e.clientY;

  		_offsetX=extractNumber(_target.offsetLeft);
  		_offsetY=extractNumber(_target.offsetTop);

  		_dragElement= _target;

  		document.onmousemove=mouseMove;
		  document.body.focus();

		  return false;
  	}
  }
  var dragStop=function(){
  	if(_dragElement != null || _dragElement != undefined){
		  document.onmousemove=null;
		  document.onselectstart=null;
		 	_dragElement.ondragstart=null;
		 	_dragElement=null;
		}
  }
  document.getElementById('mycv').onmousedown= dragStart;
  document.getElementById('mycv').onmouseup= dragStop;
}

function cloneItems(e) {
  var _target = e.target;
  var imgTag = function(src, alt) {
    var _img = document.createElement('img');
  	_img.setAttribute('alt', alt);
    _img.setAttribute('src', src);

    return _img
	}
	var comp = imgTag(_target.src, _target.alt),
  local = document.getElementById('mypaper');
	comp.className = 'drag itemsinit';
	local.parentNode.insertBefore(comp, local);
}

function initCanvas() {
  var listitems = document.getElementById('ingredients').children;
  canvas = document.getElementById("mypaper");
  ctx = canvas.getContext("2d");
  ctx.drawImage(bgimg, 0, 0, width, height);
  for (var i = 0; i < listitems.length; i++) {
    addEvent(listitems[i], 'click', cloneItems);
    addEvent(listitems[i], 'touchstart', cloneItems);
  }
	dragEvent();
}

function open() {
  var dataURL = canvas.toDataURL('image/png');
  document.getElementById('canvasImg').src = dataURL;
}
// addEvent(document.getElementById('mypaper'), 'click', open)
addEvent(window, 'load', initCanvas);
