var menuLeft=document.getElementById('cbp-spmenu-s1'),
		menuRight=document.getElementById('cbp-spmenu-s2'),
		menuTop=document.getElementById('cbp-spmenu-s3'),
		menuBottom=document.getElementById('cbp-spmenu-s4'),
		showLeft=document.getElementById('showleft'),
		showRight=document.getElementById('showright'),
		showTop=document.getElementById('showtop'),
		showBottom=document.getElementById('showbottom'),
		showLeftPush=document.getElementById('showleftpush'),
		showRightPush=document.getElementById('showrightpush'),
		body=document.body;

showLeft.addEventListener('click', function(){
	classie.toggle(this, 'active');
	classie.toggle( menuLeft, 'cbp-spmenu-open');
	disableOther('showLeft');
})
showRight.addEventListener('click', function(){
	classie.toggle( this, 'active');
	classie.toggle( menuRight, 'cbp-spmenu-open');
	disableOther('showRight');
})
showTop.addEventListener('click', function(){
	classie.toggle(this, 'active');
	classie.toggle(menuTop, 'cbp-spmenu-open');
	disableOther('showTop');
})
showBottom.addEventListener('click', function(){
	classie.toggle( this, 'active');
	classie.toggle( menuBottom, 'cbp-spmenu-open');
	disableOther('showBottom');
})
showLeftPush.addEventListener('click', function(){
	classie.toggle(this, 'active');
	classie.toggle(body, 'cbp-spmenu-push-toright');
	classie.toggle(menuLeft, 'cbp-spmenu-open');
	disableOther('showLeftPush');
})
showRightPush.addEventListener('click', function(){
	classie.toggle(this, 'active');
	classie.toggle(body, 'cbp-spmenu-push-toleft');
	classie.toggle(menuRight, 'cbp-spmenu-open');
	disableOther('showRightPush');
})

function disableOther(button){
	if( button !== 'showLeft' ) {
		classie.toggle( showLeft, 'disabled' );
	}
	if( button !== 'showRight' ) {
		classie.toggle( showRight, 'disabled' );
	}
	if( button !== 'showTop' ) {
		classie.toggle( showTop, 'disabled' );
	}
	if( button !== 'showBottom' ) {
		classie.toggle( showBottom, 'disabled' );
	}
	if( button !== 'showLeftPush' ) {
		classie.toggle( showLeftPush, 'disabled' );
	}
	if( button !== 'showRightPush' ) {
		classie.toggle( showRightPush, 'disabled' );
	}
}