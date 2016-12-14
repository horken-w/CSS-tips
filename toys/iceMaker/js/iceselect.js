var canvas, ctx;
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
function imageLoading(source ,callback){
  var loadImg=0, countImg=0, images={};
  for (var src in source){
    countImg++;
  }
  for (var src in source){
    images[src]= new Image();
    images[src].onload=function(){
      if(++loadImg >= countImg) callback(images);
    }
    images[src].src=source[src];
  };
  return images;
}
function getBackground(evt){
  var iceModel, _tarimg=evt.target.id;
  switch (_tarimg){
    case 'pureice':
      iceModel={pureice: './images/icebg/ice-01-bg.png'};
      imageLoading(iceModel, function(images){ ctx.drawImage(images.pureice, 0, 0, canvas.width, canvas.height);});
      break;
    case 'purpleice':
      iceModel={purpleice: './images/icebg/ice-02-bg.png'};
      imageLoading(iceModel, function(images){ ctx.drawImage(images.purpleice, 0, 0, canvas.width, canvas.height);});
      break;
    case 'blackice':
      iceModel={blackice: './images/icebg/ice-03-bg.png'};
      imageLoading(iceModel, function(images){ ctx.drawImage(images.blackice, 0, 0, canvas.width, canvas.height);});
      break;
    case 'blueice':
      iceModel={blueice: './images/icebg/ice-04-bg.png'};
      imageLoading(iceModel, function(images){ ctx.drawImage(images.blueice, 0, 0, canvas.width, canvas.height);});
      break;
    case 'orangeice':
      iceModel={orangeice: './images/icebg/ice-05-bg.png'};
      imageLoading(iceModel, function(images){ ctx.drawImage(images.orangeice, 0, 0, canvas.width, canvas.height);});
      break;
    case 'yellownOrange':
      iceModel={yellownOrange: './images/icebg/ice-06-bg.png'};
      imageLoading(iceModel, function(images){ ctx.drawImage(images.yellownOrange, 0, 0, canvas.width, canvas.height);});
      break;
    case 'snowmanice':
      iceModel={snowmanice: './images/icebg/ice-07-bg.png'};
      imageLoading(iceModel, function(images){ ctx.drawImage(images.snowmanice, 0, 0, canvas.width, canvas.height);});
      break;
    case 'sunice':
      iceModel={sunice: './images/icebg/ice-08-bg.png'};
      imageLoading(iceModel, function(images){ ctx.drawImage(images.sunice, 0, 0, canvas.width, canvas.height);});
      break;
    case 'retangleice':
      iceModel={retangleice: './images/icebg/ice-09-bg.png'};
      imageLoading(iceModel, function(images){ ctx.drawImage(images.retangleice, 0, 0, canvas.width, canvas.height);});
      break;
    case 'meatice':
      iceModel={meatice: './images/icebg/ice-11-bg.png'};
      imageLoading(iceModel, function(images){ ctx.drawImage(images.meatice, 0, 0, canvas.width, canvas.height);});
      break;
    case 'bubble':
      iceModel={bubble: './images/icebg/ice-10-bg.png'};
      imageLoading(iceModel, function(images){ ctx.drawImage(images.bubble, 0, 0, canvas.width, canvas.height);});
      break;
    case 'noneice':
      iceModel={noneice: './images/icebg/ice-12-bg.png'};
      imageLoading(iceModel, function(images){ ctx.drawImage(images.noneice, 0, 0, canvas.width, canvas.height);});
      break;
    default:
      console.log('ice none found');
      break;
  }
  localStorage.setItem('icetype', iceModel[_tarimg]);
};
function initCanvas() {
  var initbg, listitems = tag('ingredients') ? tag('ingredients').getElementsByClassName('imgpackage')[0].children : tag('formwrap');
  canvas = tag("mypaper");
  ctx = canvas.getContext("2d");
  window.addEventListener('resize', detectPortrait('wrap'));
  if(tag('ingredients')){
    initbg = {pureice: './images/icebg/ice-01-bg.png'};
    imageLoading(initbg, function(images){ ctx.drawImage(images.pureice, 0, 0, canvas.width, canvas.height);});
  }
  else{
    initbg={ final:localStorage.getItem('final')}
    imageLoading(initbg, function(images){ ctx.drawImage(images.final, 0, 0, canvas.width, canvas.height);});
  }
  
  
  for (var i = 0; i < listitems.length; i++) {
    hasTouch
      ? addEvent(listitems[i], 'touchstart', getBackground)
      : addEvent(listitems[i], 'click', getBackground);
  }
}
addEvent(window, 'load', initCanvas);
window.addEventListener('load', detectPortrait('wrap'));

function detectPortrait(mainDiv) { // detect screen
  if (screen.width < screen.height) {
    tag(mainDiv).className = "portrait_mode";
  }
  else {
     tag(mainDiv).classList.remove('hidden');
  }
}

function moveTo(){ window.location='waterice.html';}

function projectSubmite(){
  var xhr = new XMLHttpRequest();
  xhr.open('post', 'URL here');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
      if (xhr.status === 200) {
          var userInfo = JSON.parse(xhr.responseText);
      }
  };
  xhr.send(JSON.stringify({
      name: 'John Smith',
      project: localStorage.getItme('final')
  }));
  localStorage.clear();
}