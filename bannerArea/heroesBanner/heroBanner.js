(function(window, $){
	let point_bar = $('.point_bar'),
		owlCarousel = $('.owl-carousel'),
		currectTarget = 0;

	function resetPointerBar() {
		const itemWidth = $('.cursor_maske');
		point_bar.css('width', itemWidth[0].offsetWidth);
		point_bar.css('left', itemWidth.eq(currectTarget).offset().left);
	}

	function movePointBar(evt) {
		const target = evt.currentTarget;
		currectTarget = target.dataset.slider - 1;
		point_bar.css('left', $(target).offset().left);
		owlCarousel.trigger('to.owl.carousel', currectTarget);
		fontColorChange();
	}

	function fontColorChange(){
		const targetUrl = $('.active').find('.item').css('backgroundImage').slice(4, -1).replace(/"/g, "");
		getImgBrightness(targetUrl);
	}

	owlCarousel.owlCarousel({
		animateOut: 'fadeOut',
		animateIn: 'fadeIn',
		items: 1,
		dots: false,
		loop: false,
		mouseDrag: false,
		stagePadding: 0,
		smartSpeed: 450,
		autoplay:false,
		autoplayTimeout:3000,
		autoplayHoverPause:true
	});
	resetPointerBar();
	fontColorChange();
	$(window).on('resize', resetPointerBar);

	$('.cursor_maske').on('click', movePointBar)


	function getImgBrightness(detectedURL){
		const detectedImg = document.createElement('img');
		detectedImg.id = 'detected_img';
		detectedImg.src = detectedURL;
		detectedImg.style.display = 'none';
		detectedImg.crossOrigin = "Anonymous";
		document.body.appendChild(detectedImg);

		detectedImg.onload = function(){
			const cvs = document.createElement('canvas');
			cvs.width = this.width;
			cvs.height = this.height;
			
			const ctx = cvs.getContext('2d');
			ctx.drawImage(this, 0, 0);

			const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height/3*2),
					data = imageData.data;

			let r, g, b, avg, colorSum = 0;
			for(var x = 0, len = data.length; x < len; x += 4){
				r = data[x];
				g = data[x+1]
				b = data[x+2]
				avg = Math.floor((r+g+b)/3);
				colorSum += avg;
			}
			
			var brightness = Math.floor(colorSum / (this.width * this.height/3*2));
			console.log(brightness);
			if(brightness < 135){
				$('.number_mark').css('color', 'white');
				$('.diamond').css('border-color', 'white');
				$('.disc_lebel').css('color', 'white');
			}
			else{
				$('.number_mark').css('color', 'black');
				$('.diamond').css('border-color', 'black');
				$('.disc_lebel').css('color', 'black');
			}
		}
		document.getElementById('detected_img').remove()
	}
})(window, $)