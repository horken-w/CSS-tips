$('.topImage').css('width', '50%');
$('.beforeAfterSlidebar').on('mousemove', function(e){
	var offset = $(this).offset();
	console.log(offset.left);
	var itw=(e.pageX - offset.left);
	$(this).find('.topImage').width(itw);
})