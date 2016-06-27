(function(){
	function supportsCanvas() {
		return !!document.createElement('canvas').getContext;
	};

	function leftSpace(){
		var pct = (this.fullAmount(32) * 100) | 0;
    var canvas = document.getElementById('mycanvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width, height = canvas.height, alpha = 0;
    var img = new Image();
        img.src='./images/articuno1.png'

    var showPhoto = function(){

        // increase alpha with delta value
        alpha += 0.03;

        if(alpha >= 1) return false;

        // clear canvas
        ctx.clearRect(0, 0, width, height);

        // set global alpha
        ctx.globalAlpha = alpha;

        // re-draw image
        ctx.drawImage(img, 0, 0);

        // loop using rAF
        requestAnimationFrame(showPhoto);
    }

    if(pct >= 80){
        img.onload=function(){  showPhoto();};
        this.removeEventListener('scratch');
        $('#mycanvas').wrap('<a href="#">');
    }

	}

	function initPage(){
		var loadedCount = 0;
		var i, il;
		var paper = new Scratcher('mycanvas');
		paper.addEventListener('scratch', leftSpace);
	}

	$(function(){
		supportsCanvas() ? initPage() : $('#lamebrowser').show();
	})
})()