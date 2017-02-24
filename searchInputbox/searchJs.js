!function(window, document){
	'user strict';

	var dataList = ['Articuno', 'Arcanine', 'Suicune', 'Poliwhirl', 'Ditto'];

	var domRoot = {
		root: $('.txtsearch'),
		select: $('.txt-selectbox'),
		input: $('.txt-inputexpend'),
		listArea: $('.txt-ctrl'),
		ul: $('#searchbox')
	}, value=[];

	function fastSearchFilter(){
		var inputBox = domRoot.input;
		domRoot.input.on('focus', function(){
			domRoot.root.addClass('ckactive');
			domRoot.ul.fadeIn(500);
		})

		domRoot.listArea.on('click', function(){
			domRoot.input.focus();
		})

		$(document).on('click', function(evt){
			if($(evt.target).prop("tagName") !== "INPUT" && !$(evt.target).hasClass('txt-ctrl')
				&& !$.contains(domRoot.ul[0], evt.target)){
				domRoot.root.removeClass('ckactive');
				domRoot.ul.fadeOut(500);
			}
		})
		this.export = function(){
			select = domRoot.select;

			return select.val();
		}

		inputBox.on('keyup', function(evt){
			var search = evt.target.value.toLowerCase();
			if(!search)
				$(domRoot.ul).children().show();
		    else {
				$(domRoot.ul).children().each(function(){
					var text = $(this).text().toLowerCase();
					(text.indexOf(search) >= 0) ? $(this).show() : $(this).hide();
				});
			};
		})
	}

	function findArrayIndex(array, value){
		return array.indexOf(value);
	}

	function selectOptions(value){
		if(value.length){
			domRoot.select.val(value);
			setToInput();
		}
		else{
			domRoot.select.val('');
			defaultInput();
		}
	}

	function setToInput(){
		var selectData = domRoot.select.val(), 
			div=$('<div class="txt-select-item" />'),
			btn=$('<button class="removebtn" type="button">X</button>'),
			width = 0;

		defaultInput(selectData);

		btn.on('click', function(evt){
			event.stopPropagation();

			var idx = findArrayIndex(value, $(this).parent().text().substring(0, $(this).parent().text().length-1));
			$('.selected').map(function(i, v){
				if($(v).text() === value[idx]) $(this).removeClass('selected')
			})
			if(idx>-1) value.splice(idx, 1);
			selectOptions(value);
			$(this).parent().remove();
		});

		selectData.map(function(v, i){
			var _div = div.clone();
			_div.text(v);
			_div.append(btn.clone(true));
			domRoot.listArea.prepend(_div);
			width+=(_div.outerWidth()+15);
		})
		domRoot.input.css('width', domRoot.input.width()-width);

	}

	function defaultInput(data){
		$('.txt-select-item').remove();
		domRoot.input.css('width', '100%');	}

	function madeSearchItem(data, root){
		data.map(function(v, i){
			var li=$('<li class="txt-item" />');
			li.text(data[i]).on('click', function(){
				if(!$(this).hasClass('selected')){
					value.push($(this).text());
					$(this).addClass('selected');
				}
				else{
					$(this).removeClass('selected');
					var idx = findArrayIndex(value, $(this).text());
					if(idx>-1) value.splice(idx, 1);
				}
				selectOptions(value);
			}).appendTo(domRoot.ul);
		})

		
	}

	dataList.map(function(v, i){
		var opt = $('<option>');
		opt.val(dataList[i]).text(dataList[i]);
		opt.appendTo(domRoot.select);
	})
	madeSearchItem(dataList);
	var selectStruct = new fastSearchFilter();
	window.onload = selectStruct;

	
	$('#clickme').on('click', function(){
		$('#showselect').text(selectStruct.export());
	})
	
}(window, document);