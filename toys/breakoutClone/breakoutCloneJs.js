var x = 25, y = 250, dx = 1.5, dy = -4, ctx;
var width, height; 
var paddlex, paddleh = 10, paddlew = 75;
var rightDown = false, leftDown = false;
var canvasMinX = 0, canvasMaxX = 0, intervalId = 0;
var bricks, nrows=5, ncols=5;
var brickwidth, brickheight = 15, padding = 1;

function init(){
  var canvas=document.getElementById('mycanvas');
  ctx=canvas.getContext('2d');
  width=document.getElementById('mycanvas').width;
  height=document.getElementById('mycanvas').height;
  paddlex=width / 2;
  brickwidth = (width/ncols) - 1;
  canvasMinX = document.getElementById('mycanvas').offsetLeft;
  canvasMaxX = canvasMinX + width;
  intervalId = setInterval(draw, 10);
}
function circle(x, y, r){
  ctx.fillStyle = 'hsla(180, 50%, 30%, 0.6)';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}
function rect(x, y, w, h){
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.closePath();
  ctx.fill();
}
function clear(){
  ctx.clearRect(0, 0, width, height);
}
function onKeyDown(evt){
  if (evt.keyCode == 39) rightDown = true;
  else if (evt. keyCode == 37) leftDown = true;
}
function onKeyUp(evt){
  if (evt.keyCode == 39) rightDown = false;
  else if (evt. keyCode == 37) leftDown = false;
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function onMouseMove(evt){
  if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX){
    paddlex= evt.pageX - canvasMinX;
  }
}
document.addEventListener('mousemove', onMouseMove);

function initbricks(){
	bricks=new Array(nrows);
  for ( let i=0; i<nrows; i++){
  	bricks[i] =new Array(ncols);
    for( let j=0; j<ncols; j++){
      bricks[i][j] = 1;
    }
  }
}
function drawbricks(){
  for( let i=0; i < nrows; i++){
  	ctx.fillStyle = rowcolors[i];
    for( let j=0; j<ncols; j++){
      if (bricks[i][j] == 1){
        rect((j*(brickwidth + padding)) + padding,
            (i * (brickheight + padding)) + padding,
             brickwidth, brickheight);
      }
    }
  }
}