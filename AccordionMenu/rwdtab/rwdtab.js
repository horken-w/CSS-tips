var $content=$('.accordion-content');
if($(window).width()>768){
	$('.accordion-content:not(:first)').hide();
	$('.accordion-title:first-child').addClass('active');
}else	$($content).hide();
	
$($content).wrapInner('<div class="overflow-scroll"></div>');
$('.accordion-title').on('click', function(){
	$($content).hide();
	$(this).next().fadeIn(500).prev().addClass('active').siblings().removeClass('active');
});