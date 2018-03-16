$(document).ready(function(){
	// sticky menu
	let menuPosition = $('.sticky').offset();
	$(window).on('scroll', function(){
		if($(window).scrollTop() > menuPosition.top) $('.sticky').addClass('is_sticky');
		else $('.sticky').removeClass('is_sticky');
	})

	// work Introduction
	$('figure').hover(function(){
		// debugger;
		var idx = $(this).data('index');
		if($('.appear').length) $('.appear').removeClass('appear');
		$('.work_intro').eq(idx).addClass('appear');
	});

	// portfolio
	var $container = $('.portfolio_items');
	$container.imagesLoaded(function(){
		$container.isotope({
			itemSelector : '.portfolio_item',
			layoutMode : 'fitRows',
			filter: '*'
		});
	})

	$('.protfolio_nav_list a').click(function(){
		$('.protfolio_nav_list .active').removeClass('active');
		$(this).addClass('active');

		var selected=$(this).attr('data-filter');
		$container.isotope({ filter: selected})
		return false;
	})

	// partaner
	var owl = $('.ppl-carousel');
	owl.owlCarousel({
		items: 5,
		loop: true,
		margin: 10,
		autoplay:true,
		autoplayTimeout: 2000,
		autoplayHoverPause: true
	});

	// blog
	var owl = $('.small-carousel');
	owl.owlCarousel({
		items: 1,
		loop: true,
		margin: 10,
		autoplay:true,
		autoplayTimeout: 2000,
		autoplayHoverPause: true
	});

	//masonry
	var blogPost = $('.masonry');
	blogPost.imagesLoaded(function(){
		blogPost.masonry({
			itemSelector: '.blog-post'
		})
	})

	/* Full Backgrounf Slider */ 
	$('#slides_background').superslides({
      animation: 'fade',
      play: 5000
    });
	
})