window.requestAnimFrame = (function(){ //animation repeat
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var Fireworks = (function() {
    var particles = [],
        mainCanvas = null,
        mainContext = null,
        fireworkCanvas = null,
        fireworkContext = null,
        viewportWidth = 0,
        viewportHeight = 0;

    function initialize() {
        onWindowResize();

        mainCanvas = document.createElement('canvas');
        mainContext = mainCanvas.getContext('2d');

        fireworkCanvas = document.createElement('canvas');
        fireworkContext = fireworkCanvas.getContext('2d');

        createFireworkPalette(12);
        setMainCanvasDimensions();

        document.body.appendChild(mainCanvas);
        document.addEventListener('mouseup', createFirework, true);
        document.addEventListener('touchend', createFirework, true);
        update();
    }

    function createFirework(){

    }

    function createFireworkPalette(gridSize) {
        var size = gridSize * 10;
        fireworkCanvas.width = size;
        fireworkCanvas.height = size;
        fireworkContext.globalCompositeOperation = 'source-over';

        for (var c = 0; c < 100; c++) {

            var marker = (c * gridSize);
            var gridX = marker % size;
            var gridY = Math.floor(marker / size) * gridSize;

            fireworkContext.fillStyle = "hsl(" + Math.round(c * 3.6) + ",100%,60%)";
            fireworkContext.fillRect(gridX, gridY, gridSize, gridSize);
            fireworkContext.drawImage( Library.bigGlow, gridX, gridY);
        }
    }

    function setMainCanvasDimensions(){
    	mainCanvas.width = viewportWidth;
    	mainCanvas.height = viewportHeight;
    }

    function update() {
        clearContext();
        requestAnimFrame(update);
        drawFireworks();
    }

    function clearContext() {
        mainContext.fillStyle = 'rgba(0, 0, 0, 0.2)';
        mainContext.fillRect(0, 0, viewportWidth, viewportHeight);
    }

    function drawFireworks() {
      var a = particles.length;

      while (a--) {
        var firework = particles[a];
        if (firework.update()) {
          particles.splice(a, 1);
          if (!firework.usePhysics) {
            if (Math.random() < 0.8)
              fireworkExplosions.start(firework);
            else
              fireworkExplosions.circle(firework);
         }
      }
      firework.render(mainContext, fireworkCanvas);
    }
  }

  function createParticle(){

  }

  function onWindowResize(){

  }

  return {
   	initialize: initialize,
    createParticle: createParticle
  };
})();
var particle = function(pos, targ, vel, marker, usePhysics) {
  this.gravity = 0.06;
  this.alpha = 1;
  this.easing = Math.random() * 0.02;
  this.fade = Math.random() * 0.1;
  this.gridX = marker % 120;
  this.gridY = Math.floor(marker / 120) * 12;
  this.color = marker;
  this.pos = {
    x: pos.x || 0,
    y: pos.y || 0
  };
  this.vel = { //particles velocity 
    x: vel.x || 0,
    y: vel.y || 0
  };
  this.lastPos = {
    x: this.pos.x,
    y: this.pox.y
  };
  this.target = {
    y: target.y || 0
  };
  this.usePhysics = usePhysics || false;
}

var Library = {
	bigGlow: document.getElementById('big-glow'),
	smallGlow: document.getElementById('small-glow')
};

//Let's Start
window.onload = function() { Fireworks.initialize(); }
