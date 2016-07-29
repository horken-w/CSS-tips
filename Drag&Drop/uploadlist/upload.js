(function(){
	var input = document.getElementById('images'),
			formdata = false;

	if(window.FormData){
		formdata = new FormData();
		document.getElementById('sent').style.display = 'none';
	}

	function showUploadedItem(file){
		var list = document.getElementById('image-list'),
				li = document.createElement('li'),
				img = document.createElement('img'),
				span = document.createElement('span');

		img.src = file.result;
		span.innerHTML = file.name;
		span.addEventListener('click', addToEdit);
		li.appendChild(img);
		li.appendChild(span);
		list.appendChild(li);
	}

	function addToEdit(evt){
		var _this = evt.target, orgtxt = _this.innerText,
				input = document.createElement('input'), editable=evt.type;
		if('click' == editable){
			_this.innerHTML='';
			_this.appendChild(input);
			_this.children[0].value = orgtxt;
			_this.children[0].focus();
			_this.children[0].addEventListener('blur', addToEdit);
			_this.children[0].removeEventListener('click', addToEdit); 
		}
		else{
			orgtxt = _this.value;
			_this.parentElement.innerHTML=orgtxt;
		}

	}

	input.addEventListener('change', function(evt){
		var i=this.files.length, reader, img, file;

		document.getElementById('response').innerHTML = 'uploading....';

		for( ;i--;){
			file = this.files[i];

			if(!!file.type.match('image.*')){
				reader = new FileReader();
				reader.name = file.name;
				reader.addEventListener('load',function(e){
					showUploadedItem(e.target);
				})
				reader.readAsDataURL(file);
			}
			formdata.append('images[]', file);
		}
		if(formdata){
			var uploadURL = 'http://hayageek.com/examples/jquery/drag-drop-file-upload/upload.php';

			$.ajax({
		    url: uploadURL,
		    type: "POST",
		    data: formdata,
		    processData: false,
		    contentType: false,
		    success: function (res) {
		      document.getElementById("response").innerHTML = res; 
		    }
		  });
		}
	})
})()