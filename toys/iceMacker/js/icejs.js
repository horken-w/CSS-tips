var canvas;
var ctx, imagePackage;
var posX=0, posY=0, angle=0;
var _startX, _startY, _offsetX, _offsetY, _dragElement;
var bgimg = new Image();  
bgimg.src = localStorage.getItem('icetype');
var hasTouch = 'ontouchstart' in document;

function addEvent(obj, evt, fn) {
  if (obj.addEventListener)
    obj.addEventListener(evt, fn, false);
  else if (obj.attachEvent)
    obj.attachEvent('on' + evt, fn);
}
function tag(tag){
  return document.getElementById(tag);
}
var actionBtn=function(){
  document.getElementsByClassName('btn_action')[0].classList.remove('hidden');
  return document.getElementsByClassName('btn_action')[0];
}
function dragEvent() { // mouse drag & touch drag
  var canvas=tag('mycv');

  var extractNumber= function(num){
   	var n=parseInt(num);
   	return n==null || isNaN(n)? 0: n;
	}
  var onMoveEvent=function(e){
  	if(e==null) var e=window.event;
    if(!e.touches){
      _dragElement.style.left=(_offsetX+e.clientX-_startX)+'px';
      _dragElement.style.top=(_offsetY+e.clientY-_startY)+'px';
    }else if(e.target.parentNode.classList[0] == 'drag'){
      e.preventDefault();
      _dragElement.style.left=(_offsetX+e.touches[0].clientX-_startX)+'px';
      _dragElement.style.top=(_offsetY+e.touches[0].clientY-_startY)+'px';
    }
  }
  var onStartEvent=function(e){
  	e.touches == null ? e: e=e.touches[0];
  	var _target=e.target.parentNode != null ? e.target.parentNode: e.srcElement.parentElement;
    tag('pickup') === null ? '' : tag('pickup').removeAttribute('id');
    _target.className === 'drag' ? _target.id ='pickup' : 
      _target.parentNode.className ==='drag' ?
      _target.parentNode.id ='pickup' : '';

  	if(e!=null && _target.classList[0] == 'drag'){
      _target.appendChild(actionBtn());
  		_startX=e.clientX;
  		_startY=e.clientY;

  		_offsetX=extractNumber(_target.style.left);
  		_offsetY=extractNumber(_target.style.top);

  		_dragElement= _target;
      if(!hasTouch)	document.onmousemove=onMoveEvent;
		  document.body.focus();
		  return false;
  	} else if (!document.getElementById('pickup')) {
      if(document.getElementsByClassName('btn_action')[0].classList.length === 1)
        document.getElementsByClassName('btn_action')[0].className += ' hidden';
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
var getMirDirection = function(tarimg){
  var transScaleRegex = /\.*scaleX\(([-+]?[0-9])\)/g;
  return parseInt(transScaleRegex.exec(tarimg.getAttribute('style'))[1]||1);
}
var getRotAngle = function(tarimg){
  var transRotateRegex= /\.*rotate\((\d*deg)\)/g;
  return parseInt(transRotateRegex.exec(tarimg.getAttribute('style'))[1])||0;
}
function reSizeImg(){
  var deg=0,range=1.2, mirX=1; 
  var growItem = function(){
    var tarimg= tag('pickup')!=undefined ? tag('pickup').childNodes[0] : document.getElementsByClassName('drag')[0].childNodes[0];
    if(tarimg.height < tarimg.naturalHeight){
       tarimg.style.height=tarimg.height*range+'px';
    }
  };
  var shrinkItem= function(){
    var tarimg= tag('pickup')!=undefined ? tag('pickup').childNodes[0] : document.getElementsByClassName('drag')[0].childNodes[0];
    if(tarimg.height > tarimg.naturalHeight*0.6){
       tarimg.style.height=tarimg.height/range+'px';
    }
  }
  
  var rotateItem= function(){
    var tarimg= tag('pickup')!=undefined ? tag('pickup').childNodes[0] : document.getElementsByClassName('drag')[0].childNodes[0] || undefined;
    if(tarimg !== undefined){
      var mirX = getMirDirection(tarimg);
      var deg = getRotAngle(tarimg);
      deg>345 ? deg=45 : deg+=45;
      tarimg.style.transform='rotate('+deg+'deg) scaleX('+mirX+')';
    }
  }
  var reflexionItem= function(){
    var tarimg= tag('pickup')!=undefined ? tag('pickup').childNodes[0] : document.getElementsByClassName('drag')[0].childNodes[0] || undefined;
    if(tarimg !== undefined){
      var mirX = getMirDirection(tarimg);
      var deg = getRotAngle(tarimg);
      if(mirX === 1){
        mirX =-1;
      }else{
        mirX =1;
      }
      tarimg.style.transform='rotate('+deg+'deg) scaleX('+mirX+')';
    }
  }
  var removeItem=function(){
    var tarimg= tag('pickup')!=undefined ? tag('pickup').childNodes[0] : document.getElementsByClassName('drag')[0].childNodes[0];
    tag('mycv').children[0].appendChild(actionBtn());
    document.getElementsByClassName('btn_action')[0].className += ' hidden';
    tarimg.remove();
  }
  addEvent(tag('grow'), 'click', growItem);
  addEvent(tag('shrink'), 'click', shrinkItem);
  addEvent(tag('rotate'), 'click', rotateItem);
  addEvent(tag('mirrored'), 'click', reflexionItem);
  addEvent(tag('remove'), 'click', removeItem);
}
function cloneItems(e) {
  var _target = e.target;
  if(document.getElementsByClassName('btn_action')[0].classList.length === 1)
    document.getElementsByClassName('btn_action')[0].className +=' hidden';
  var imgTag = function(src, alt) {
    var _img = document.createElement('img'), _div=document.createElement('div');
  	_img.setAttribute('alt', alt ? alt : '食物被偷吃掉了') ;
    src ? _img.setAttribute('src', src) : '';;
    _img.style.height=_img.height*0.8+'px';
    _img.style.transform='rotate(0deg) scaleX(1)';
    _div.appendChild(_img)
    _div.style.left=200+'px';
    _div.style.top=280+'px'

    return _div;
	}
  if(_target.localName === 'div'){
    var comp = imgTag(imagePackage[_target.id] !== undefined ? imagePackage[_target.id].src : '', _target.id|| ''),
    local = tag('mypaper');
    comp.className = 'drag';
    local.parentNode.insertBefore(comp, local);
  }
}
function imageSetting(){
	// var imgitems=document.getElementsByClassName('drag'),
	// 		canv=tag('mypaper'),
	// 		objlen=imgitems.length;
			
	// var Imagesdraw = function(obj){
 //    var TO_RADIANS = Math.PI/180;
	// 	ctx.drawImage(obj.obj, obj.x, obj.y, obj.width, obj.height);
	// }
	// while (imgitems[0] != undefined){
	// 	var imgobj={};
	// 	imgobj.x=imgitems[0].offsetLeft-canv.offsetLeft;
	// 	imgobj.y=imgitems[0].offsetTop-canv.offsetTop;
	// 	imgobj.obj=imgitems[0];
 //    imgobj.width=imgitems[0].width;
 //    imgobj.height=imgitems[0].height;
	// 	Imagesdraw(imgobj);
	// 	imgobj.obj.parentNode.removeChild(imgobj.obj);
	// }
 //  open();
  tag('ingredients').className ='hidden';
  document.getElementsByClassName('btn_action')[0].className='hidden';

  html2canvas(document.body, {
    onrendered: function(canvas) {
      var dataURL = canvas.toDataURL('image/png');
      var orgimg = new Image();
      orgimg.src=dataURL;
      orgimg.onload=function(){
        canvas = tag("mypaper");
        ctx.drawImage(orgimg, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        var dataURLN = canvas.toDataURL('image/png');
        localStorage.setItem('final', dataURLN);
        window.location='./preview.html';
      }
    }
  });
}

function imageLoading(callback){
  var source = { 
    gummy: './images/ingredientsItem/item-001.png',
    gummybear: './images/ingredientsItem/item-002.png',
    cottoncandy: './images/ingredientsItem/item-004.png',
    taro: './images/ingredientsItem/item-003.png',
    straws: './images/ingredientsItem/item-007.png',
    dumpling: './images/ingredientsItem/item-005.png'
  }, loadImg=0, countImg=0, images={};
  for (var src in source){
    countImg++;
  }
  for (var src in source){
    images[src]= new Image();
    // images[src].onload=function(){
    //   if(++loadImg >= countImg) callback(images);
    // }
    images[src].src=source[src];
  };
  return images;
}
function chkIndexOf(actionTarg){
  for(var i=1; i< actionTarg.length; i++){
    if (actionTarg[i].classList.length ==2)
       return i;
  }
}
function initCanvas() {
  var listitems = tag('ingredients').children;
  canvas = tag("mypaper");
  ctx = canvas.getContext("2d");
  ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height);
  imagePackage=imageLoading()
  listitems[0].children[0].id='active';
  tag('active').children[0].click();
  for (var i = 0; i < listitems.length; i++) {
    if(i < listitems.length-1){
      listitems[i].children[0].addEventListener('click', function(e){
        var _this=e.target.parentElement;
        tag('active') ? tag('active').removeAttribute('id') : '';
        _this.id='active';
      })
    }
    hasTouch
      ? addEvent(listitems[i], 'touchstart', cloneItems)
      : addEvent(listitems[i], 'click', cloneItems);
  }
	
  dragEvent();
  reSizeImg();

  addEvent(tag('draw'), 'tuchstart', imageSetting);
  addEvent(tag('draw'), 'click', imageSetting);
}
addEvent(window, 'load', initCanvas);
!function(){
  tag('btn_next').addEventListener('click', function(){
    var actionTarg = tag('active').parentElement;
    var idx= chkIndexOf(actionTarg.children);
    actionTarg.children[idx].className+= ' hidden';
    (idx+1 > actionTarg.children[idx].classList.length) ? idx=1 : idx++;
    actionTarg.children[idx].classList.remove('hidden');
  })
  tag('btn_prev').addEventListener('click', function(){
    var actionTarg = tag('active').parentElement;
    var idx= chkIndexOf(actionTarg.children);
    actionTarg.children[idx].className+= ' hidden';
    (idx-1 < 1) ? idx=actionTarg.children[idx].classList.length : idx--;
    actionTarg.children[idx].classList.remove('hidden');
  })
}();