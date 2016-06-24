(function(){
	function supportsCanvas() {
		return !!document.createElement('canvas').getContext;
	};

	function leftSpace(){
		var pct = (this.fullAmount(32) * 100) | 0;

		pct >= 80 ? console.log('20% left'): console.log('good Luck');

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