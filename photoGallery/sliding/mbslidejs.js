if (navigator.msMaxTouchPoints) {

  $('#slider').addClass('ms-touch');

  $('#slider').on('scroll', function() {
    $('.slide-image').css('transform','translate3d(-' + (120-$(this).scrollLeft()/10) + 'px,0,0)');
  });

} else {
    var slider = {
        el: {
            slider: $('#slider'),
            holder: $('.holder'),
            imgSlide: $('.slide-image')
        },
        slideWidth: $('#slider').width(),
        touchstartx: undefined,
        touchmovex: undefined,
        movex: undefined,
        index: 0,
        longTouch: undefined,

        init: function(){
            this.bindUIEvents();
        },
        bindUIEvents: function(){
            this.el.holder.on('touchstart', function(e){
                slider.start(e);
            });
            this.el.holder.on('touchmove', function(e){
                slider.move(e);
            })
            this.el.holder.on('touchend', function(e){
                slider.end(e);
            });
        },
        start: function(e){
            this.longTouch=false;
            setTimeout(function(){
                window.slider.longTouch= true;
            }, 250);
            this.touchstartx= e.originalEvent.touches[0].pageX;
            $('.animate').removeClass('animate');
        },
        move: function(e){
            this.touchmovex= e.originalEvent.touches[0].pageX;
            this.movex=this.index * this.slideWidth+(this.touchstartx-this.touchmovex);
            var panx= 120- this.movex / 10;

            if(this.movex< 1000){
                this.el.holder.css('transform', 'translate3d(-'+ this.movex+'px, 0, 0)');
            }
            if(panx <100){
                this.el.imgSlide.css('transform', 'translate3d(-'+panx+'px, 0, 0)');
            }
        },
        end: function(e){
            var absMove= Math.abs(this.index * this.slideWidth-this.movex);
            
            if(absMove > this.slideWidth / 2 || this.longTouch === false){
                if(this.movex > this.index*this.slideWidth &&this.index <this.el.imgSlide.length-1) this.index++;
                else if(this.movex < this.index*this.slideWidth && this.index> 0) this.index--
            }
            this.el.holder.addClass('animate').css('transform', 'translate3d(-' + this.index*this.slideWidth + 'px,0,0)');
            this.el.imgSlide.addClass('animate').css('transform', 'translate3d(-' + 100-this.index*50 + 'px,0,0)');
        }
    };
    slider.init();
}

