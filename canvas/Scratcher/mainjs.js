(function(){
	function supportsCanvas() {
		return !!document.createElement('canvas').getContext;
	};

	function leftSpace(){
		var pct = (this.fullAmount(32) * 100) | 0;
	}

	// function initPage(){
	// 	var loadedCount = 0;
	// 	var i, il, paper;
	// 	paper = new Scratcher('mycanvas');
	// 	paper.addEventListener('imagesloaded', leftSpace);
	// }
	function initPage() {
		var scratcherLoadedCount = 0;
		var i, i1, paper;
			paper = new Scratcher('mycanvas');
			// paper.setImages(scratcherImage);
			// paper.addEventListener('imagesloaded', onScratcherLoaded);

	};

	$(function(){
		supportsCanvas() ? initPage() : $('#lamebrowser').show();
	})
})()