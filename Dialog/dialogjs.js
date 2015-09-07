$(function(){
	$('#dialog-called').on('click', function(){
		var dialog='<div id="bgpaper">\
					<div id="dialogBox">\
					<div class="content">\
						<div id="dialogmsg">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel saepe, distinctio non unde hic rerum aspernatur molestias consectetur culpa laborum.</div>\
						<a href="javascript:;" class="button">Close</a>\
					</div>\
				</div></div>';
		$('body').append(dialog);

		$(window).resize(function(){
			if(!$('#dialogBox').is(':hidden'))popup();
		})
	});

	$('body').on("click", '.button', function(){
			$('#bgpaper').hide();
		})
})
function popup(){
	var maskH=$(document).outerHeight(),
		maskW=$(document).outerWidth(),
		dTop=(maskH/2)-($('#dialogBox').height());
		dLeft=(maskW/3)-($('#dialogBox').width()/2);
		if(dTop < 0) dTop=0;
		if(dLeft < 0) dLeft = 0;
	$('#dialogBox').css({top: dTop,left: dLeft});
}