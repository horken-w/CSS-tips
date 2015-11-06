var pagesSlider=function(slider, options){
	this.slider=slider;
	this.content=slider.children().first();
	this.currentIndex=0;
	this.pages=this.content.children();
	this.slider.width(this.pages.first().width());

	var totalWidth=0;
	this.pages.each(function(index, page){
		totalWidth+=$(page).width();
	});
	this.content.width(totalWidth);
	this.bindEvents();
};
$.extend(pagesSlider.prototype, {
	bindEvents: function(){
		this._removeTransition=$.proxy(this.removeTransition, this);
		this._startDrag=$.proxy(this.startDrag, this);
		this._doDrag=$.proxy(this.doDrag, this);
		this._endDrag=$.proxy(this.endDrag, this);

		this.content
			.on('mousedown', this._startDrag)
			.on('transitionend', this._removeTransition);
		$('body')
			.on('mousemove', this._doDrag)
			.on('mouseup', this._endDrag);
	},
	destroy: function(){
		this.content
			.off('mousedown', this._startDrag)
			.off('transitioned', this._removeTransition);
		$('body')
			.off('mousemove', this._doDrag)
			.off('mouseup', this._endDrag);
	},
	startDrag: function(event){
		this.enableDrag=true;
		this.dragStartX=event.clientX;
	},
	doDrag: function(event){
		if(this.enableDrag){
			var position=this.pages.eq(this.currentIndex).position();
			var delta = event.clientX-this.dragStartX;

			this.content.css('transform', 'translate3d('+(delta-postion.left)+'px, 0, 0)');
			event.preventDefault();
		}
	},
	endDrag: function(event){
		if(this.enableDrag){
			this.enableDrag=false;

			var delta=event.clientX-this.dragStartX
		}
	},
})