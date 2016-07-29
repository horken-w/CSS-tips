function uploadSupCheck(){
	return window.File && window.FileList && window.FileReader;
}

function uploadImg(evt){
	var files = evt.target.files;
	if($('.showtxt')) $('.showtxt').hide();
	var form_data = new FormData();
	for(var i=0; i< files.length; i++){
		var file = files[i], itemBox = $('<div class="droparea"/>');
		if(file.type.match('image.*')){
			if(files[i].size < 2097152){
				$(this.parentElement).append(itemBox);
				var piclists = new FileReader();
				piclists.imgname = files[i].name;
				piclists.itemBox = $('.droparea').eq($.fn.serialNum++);
				piclists.addEventListener('load', function(evt){
					var pic = evt.target;
					pic.itemBox.append($('<div/>')).append($('<span/>')).appendTo('#dragndrop');
					pic.itemBox.find('div').append($('<img  class="shortcut" src="'+pic.result+'" alt="'+pic.imgname+'" />'));
					pic.itemBox.find('span').text(pic.imgname);
				});
				piclists.readAsDataURL(file);
			}
			else{
				alert('image Size is too larget, please upload again.')
				$(this).val('');
			}
		}
		else{
			alert('You can only upload Image at moment.')
			$(this).val('');
		}
	}
}

function dragNdrop(node){
	$.fn.serialNum = 0;
	this.dragNdropbox = $(node);
	this.uploadArea = $('<input type="file" id="files" multiple/>');
	this.editBtn = $('<div id="edit" class="btn btn-warning"/>');
	this.deleBtn = $('<div id="dele" class="btn btn-danger"/>');

	this.init = function(){
		$('<div class="showtxt"/>').text('Drag & Drop here!!').appendTo(this.dragNdropbox);
		this.dragNdropbox.append(this.uploadArea);
		this.dragNdropbox.parent().append($('<div class="col-md-3 btn-group pull-right"/>'));
		this.uploadImg().showEditBtn().showClearBtn();
	}

	this.uploadImg = function(){
		this.uploadArea.on('change', uploadImg);
		return this;
	}

	this.showEditBtn = function(){
		$('.btn-group').append(this.editBtn.text('修改'));
		this.editBtn.on('click', this.fileUpdate);
		return this;
	}

	this.showClearBtn= function(){
		$('.btn-group').append(this.deleBtn.text('清除'));
		this.deleBtn.on('click', function(){
			$('.thumbnail').parent().remove();
			$('#files').val('');
			$(this).hide();
		});
	}

	this.itemsDelBtn = function(){

	}

	this.fileUpdate = function(){

	}
}

(function(){
	if(uploadSupCheck()) {
		var dnd = new dragNdrop('#dragndrop');
		dnd.init();
	}
	else{
		$('.errmsg').fadeIn(500);
	};
})()