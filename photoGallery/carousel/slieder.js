
	$(function(){
		setInterval(function () {
	        moveRight();
	    }, 5000);
		$('.list li:first-child').hide().appendTo('.list').fadeIn(500);
	    var slideCount = $('.list li').length, 
	    	slideWidth = $('.list li').width(),
	    	slideHeight = $('.list li').height(),
	    	UlWidth = slideCount * slideWidth;

		$('#abgneBlock').css({ width: slideWidth, height: slideHeight });
		$('.list').css({ width: UlWidth, marginLeft: - slideWidth });
		function moveRight() {
	        $('.list').animate({
	            left: - slideWidth
	        }, 600, function () {
	            $('.list li:first-child').hide().appendTo('.list').fadeIn(500);
	            $('.list').css('left', '');
	        });
    	};
	});