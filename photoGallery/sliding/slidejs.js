var slider = {
    el: {
        slider: $('#slider'),
        allSlides: $('.slide'),
        sliderNav: $('.slider-nav'),
        allNavButtons: $('.slider-nav > a')
    },
    timing: 1000,
    slideWidth: 280,
    init: function() {
        this.el.slider.on('scroll', function(e) {
            slider.moveSlidePosition(e)
        });
        this.el.sliderNav.on('click', 'a', function(e) {
            slider.handleNavClick(e, this);
        })
    },
    moveSlidePosition: function(e) {
        this.el.allSlides.css('background-position', $(e.target).scrollLeft() / 10 - 120 + 'px 0');
    },
    handleNavClick: function(e, el) {
        e.preventDefault();
        var position = $(el).attr('href').split('-').pop();

        this.el.slider.stop().animate({
            scrollLeft: position * this.slideWidth
        }, this.timing);
        this.changeActiveNav(el);
    },
    changeActiveNav: function(el) {
        this.el.allNavButtons.removeClass("active");
        $(el).addClass('active');
    }
};
slider.init();
