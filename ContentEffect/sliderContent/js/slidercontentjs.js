(function($, w, undefined){
	'use strict';

	$.ContentSlider = function(options, elem){
		this.$el = $(elem);
		this._init(options);
	}

	$.ContentSlider.defaults={
		speed: 500,
		easing: 'ease-in-out',
		current: 0
	}

	$.ContentSlider.prototype = {
		_init: function(options){
			this.options = $.extend({} , $.ContentSlider.defaults, options);
			this.$items = this.$el.find('ul > li').hide();
			this.$tabs = this.$el.find('nav > a');
			var tabsCount = this.$tabs.length;
			this.$tabs.css('width', 100/tabsCount+'%');
			this.current = this.options.current;
			this.old=0;
			this.isAnimating = false;
			
			this.$items.css('transition', 'left '+this.options.speed+'ms '+this.options.easing);

			this._updateTabs();
			this.$items.eq(this.current).show();
			this._initEvents();
		},
		_updateTabs: function(){
			this.$tabs.eq(this.old).removeClass('cs-active').end().eq(this.current).addClass('cs-active');
		},
		_initEvents: function(){
			var _that=this;
			_that.$tabs.on('click.ContentSlider', function(evt){
				var idx = $(this).index();

				if(idx !== _that.current && !_that.isAnimating){
					_that.isAnimating = true;

					var direction = idx > _that.current ? 'right' : 'left',
						$oldItem = _that.$items.eq(_that.current),
						$newItem = _that.$items.eq(idx);

					_that.old = _that.current;
					_that.current = idx;

					$newItem.css('left', direction === 'right' ? '100%' : '-100%')
					$newItem.show();

					var transitionendfn = function(){
						$oldItem.off('transitionend.ContentSlider').hide();
						_that.isAnimating = false;
					};

					$oldItem.on('transitionend.ContentSlider', transitionendfn);

					setTimeout( function(){
						$oldItem.css('left', direction === 'right' ? '-100%' : '100%');
						$newItem.css('left', '0%');
					},25)
					_that._updateTabs();
				}

				evt.preventDefault();
			})
		}
	}

	var logError = function(msg){
		if(window.console) window.console.error(msg);
	}

	$.fn.ContentSlider = function(options){
		if(typeof options === 'string'){
			var args = Array.prototype.slice.call(arguments, 1);
			this.each(function(){
				var instance = $.data(this, 'ContentSlider')
				if(!instance) {
					logError(`cannot call methods on ContentSlider prior to initialization;	attempted to call method "${options}"`);
					return;
				}
				if(!$.isFunction(instance[options]) || options.charAt(0) === '_'){
					logError( 'no such method "' + options + '" for ContentSlider instance' );
					return;
				}
				instance[options].apply(instance, args);
			})
		}
		else{
			this.each(function(){
				var instance = $.data(this, 'ContentSlider');
				if(instance) instance._init();
				else instance = $.data(this, 'ContentSlider', new $.ContentSlider(options, this))
			})
		}
		return this;
	}
})(jQuery, window)