
var tz='AM';
var close=false;

var checkTime=function(tnum, place){
  var $area=$('.in_txt'), m, h;
  switch(place.parentElement.className){
	case 'hour':
      if(place.classList[1] === 'prev') {
		h=resuceNum(tnum);
	  	$area.eq(0).val(addZero(h, true));
	  }
	  else{
	  	h=addNum(tnum);
	  	$area.eq(0).val(addZero(h, true));
	  }
	  break;
	case 'min':
	  if(place.classList[1] === 'prev') {
	 	m=resuceNum(tnum);
	    $area.eq(1).val(addZero(m));
	  }
	  else{
	 	m=addNum(tnum);
	    $area.eq(1).val(addZero(m));
	  }
	  break;
	default:
	  if($area.eq(2).val() === 'AM') $area.eq(2).val('PM');
	    else $area.eq(2).val('AM');
	    break;
	}
}
function addZero(i, hours) {
  if(hours){
  	if(i>24) i=1;
  	else if (i<1) i=24
    if(i>12) i=i-12;
  }
  else{
   	if(i>60) i=1;
   	else if(i < 1) i=60;
  }
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
function setInit(){
  var $time=$('.in_txt'), $inputbox=$('#timepicker');
  var date=new Date();
  var list=[addZero(date.getHours(), true), addZero(date.getMinutes()), tz];

  for(var i=0; i<$time.length; i++)	$($time[i]).val(list[i]);
   setValue($inputbox);
}
function setValue(inputbox){
  var $area=$('.in_txt');
  inputbox.val($area.eq(0).val()+'：'+$area.eq(1).val()+'：'+$area.eq(2).val());
}
function addNum(i){
  return ++i;
}
function resuceNum(i){
  return --i;
}
function closeIt() {
  $tab.fadeOut();
}
!function (){
  'use strict';
  var $submit=$('input[type=submit]'),$inputbox=$('#timepicker'), $tab=$('.timepicker_wrap');

  $submit.on('click', function(){
    $('label').text('輸入的時間為 '+$inputbox.val());
  });

  $inputbox.on('focus', function(){
    var input = $(this);
    if (!input.is($inputbox)) input.select();
    $tab.fadeIn(1000);
    setInit();
  });
  $('.prev').on('click', function(e){
    checkTime($(e.target.nextElementSibling.children).val(), e.target);
    setValue($inputbox);
  });
  $('.next').on('click', function(e){
    checkTime($(e.target.previousElementSibling.children).val(), e.target);
    setValue($inputbox);
  });

  }();
