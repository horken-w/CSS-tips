var slideCount = $('.list li').length, 
    slideWidth = $('.list li').width(),
    slideHeight = $('.list li').height(),
    UlWidth = slideCount * slideWidth;
function moveRight() {
    $('.list').stop().animate({
        left: - slideWidth
    }, 600, function () {
        $('.list li:first-child').appendTo('.list');
        $('.list').css('left', 0);
    });
};
function moveLeft() {
    $('.list').stop().animate({
        left: + slideWidth
    }, 600, function () {
        $('.list li:first-child').appendTo('.list');
        $('.list').css('left', 0);
    });
};
var timeing=setInterval(function () {
    moveRight();
}, 5000);
$(function(){
	$('.list li:first-child').appendTo('.list');
	$('#slider').css({ width: slideWidth, height: slideHeight });
	$('.list').css({ width: UlWidth, marginLeft: 0 }); //-slideWidth for right side slider
    $('.control_next').on('click', function(e){
        e.preventDefault();
        moveLeft();
    });
    $('.control_prev').on('click', function(e){
        e.preventDefault();
        moveRight();
    })
    $(".list").hover(function(){
        clearInterval(timeing);
    }, function(){
        timeing=setInterval(function () {
            moveRight();
        }, 5000);
    });
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