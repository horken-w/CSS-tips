var $div=$('<div />'), $a=$('<a/>');


$(function(){
	var accessToken, users;
	$.getScript('//connect.facebook.net/zh_TW/sdk.js', function(){
		FB.init({appId: '431653966959240', status: true, cookie: true, xfbml: true, version: 'v2.5', channelURL: 'http://fbi.techmore.com.tw:8080/index.html', oauth: true});
		FB.getLoginStatus(function (response){
			if (response.status === 'connected') {  
				var uid = response.authResponse.userID;
				accessToken = response.authResponse.accessToken;
				FB.api(
				  '/me?fields=accounts,photos',
				  'get',
				  function(response) {
				    console.log(response);
				    users=response;
				    var $li=$('<li/>')
					  for(var i=-1, l=users.accounts.data.length; ++i<l;){
					  	$li.clone().text('紛絲頁名稱：'+users.accounts.data[i].name+'，粉絲頁ID：'+users.accounts.data[i].id).appendTo('#lists');
					  }

				  }
				);
			} else {
				FB.login(function (response) {
					if (response.authResponse) {
						var uid = response.authResponse.userID;
						accessToken = response.authResponse.accessToken;
						FB.api(
						  '/me?fields=accounts,photos',
				  		  'get',
						  function(response) {
				      	console.log(response);
						    users=response;
						    for(var i=-1, l=users.accounts.data.length; ++i<l;){
					  		  $li.clone().text('紛絲頁名稱：'+users.accounts.data[i].name+'，粉絲頁ID：'+users.accounts.data[i].id).appendTo('#lists');
							}
						  }
						);
					} else {
						alert('登入失敗!');
					}
				}, {
					scope: 'publish_actions, manage_pages, pages_show_list, user_photos'
				});
			}
		})
	})
	$('.posts:first-child').append($('<ul id="lists"/>'));
	$('.menulg').on('click', function(e){
		e.preventDefault();
		events.dialog(e.target.innerText);
	});
	$('.submite').click(function(e){
		e.preventDefault();
		/*FB UI*/
		// $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
		// 	FB.init({appId: '431653966959240', status: true, cookie: false, xfbml: true, version: 'v2.5'});
		// 	FB.ui({
		// 	    method: 'share',
		// 	    title: 'Title Test',
		// 	    description: 'Test Description Goes here. Tahir Sada ',
		// 	    href: 'http://fbi.techmore.com.tw:8080/index.html',
		// 	    description: 'balalalala dalalalala'
		// 	    },
		// 	    function(response) {
		// 			if (response && response.post_id) {
		// 			alert('Post was published.');
		// 			} else {
		// 			  alert('Post was not published.');
		// 			  console.log(response);
		// 			}
		// 		}
		// 	);
		// });
	});
});
if($(this).scrollTop()>350) $('nav').addClass('menusm');
$(this).on('scroll', function(){
if($(this).scrollTop()>350) $('nav').addClass('menusm');
	else $('nav').removeClass('menusm');
})