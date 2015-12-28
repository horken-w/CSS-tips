
	$(function(){
		setInterval(function () {
	        moveRight();
	    }, 5000);
		$('.list li:first-child').appendTo('.list');
	    var slideCount = $('.list li').length, 
	    	slideWidth = $('.list li').width(),
	    	slideHeight = $('.list li').height(),
	    	UlWidth = slideCount * slideWidth;

		$('#slider').css({ width: slideWidth, height: slideHeight });
		$('.list').css({ width: UlWidth, marginLeft: -slideWidth });
		function moveRight() {
	        $('.list').animate({
	            left: - slideWidth
	        }, 600, function () {
	            $('.list li:first-child').appendTo('.list');
	            $('.list').css('left', 0);
	        });
    	};
    	function moveLeft() {
	        $('.list').animate({
	            left: + slideWidth
	        }, 600, function () {
	            $('.list li:first-child').appendTo('.list');
	            $('.list').css('left', 0);
	        });
    	};
	});

//jQuery(document).ready(function ($) {

//   $('#checkbox').change(function(){
//     setInterval(function () {
//         moveRight();
//     }, 3000);
//   });
  
// 	var slideCount = $('#slider ul li').length;
// 	var slideWidth = $('#slider ul li').width();
// 	var slideHeight = $('#slider ul li').height();
// 	var sliderUlWidth = slideCount * slideWidth;
	
// 	$('#slider').css({ width: slideWidth, height: slideHeight });
	
// 	$('#slider ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });
	
//     $('#slider ul li:last-child').prependTo('#slider ul');

//     function moveLeft() {
//         $('#slider ul').animate({
//             left: + slideWidth
//         }, 200, function () {
//             $('#slider ul li:last-child').prependTo('#slider ul');
//             $('#slider ul').css('left', '');
//         });
//     };

//     function moveRight() {
//         $('#slider ul').animate({
//             left: - slideWidth
//         }, 200, function () {
//             $('#slider ul li:first-child').appendTo('#slider ul');
//             $('#slider ul').css('left', '');
//         });
//     };

//     $('a.control_prev').click(function () {
//         moveLeft();
//     });

//     $('a.control_next').click(function () {
//         moveRight();
//     });

// });    