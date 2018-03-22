!function(window, document){
	'user strict';

	let domRoot = {
		root: $('.txtsearch'),
		select: $('.txt-selectbox'),
		input: $('.txt-inputexpend'),
		listArea: $('.txt-ctrl'),
		ul: $('#searchbox')
	}, value=[];

	class fastSearchFilter{
		constructor(){
			this.selectedCollection = [];

			domRoot.input.on('focus', ()=>{
				domRoot.root.addClass('ckactive');
				domRoot.ul.fadeIn(500);
			})
			$(document).off('click').on('click', (evt)=>{
				if(!$(evt.target).hasClass('txt-ctrl') && !$.contains(domRoot.listArea[0], evt.target) && !$.contains(domRoot.ul[0], evt.target)){
					domRoot.root.removeClass('ckactive');
					domRoot.ul.fadeOut(500);
				}
			})
			if(fastSearchFilter.customList.length) this.renderList();
			domRoot.ul.on('click', $.proxy(this.selectItemAction, this));
			domRoot.listArea.on('click', function(evt){
				domRoot.input.focus();
				if(evt.target.nodeName === 'BUTTON') this.removeTags(evt);
			}.bind(this));
			domRoot.input.on('keyup', function(evt){
				const search = evt.target.value.toLowerCase();
				if(!search)
					$(domRoot.ul).children().show();
				else {
					$(domRoot.ul).children().each(function(){
						const text = $(this).text().toLowerCase();
						(text.indexOf(search) >= 0) ? $(this).show() : $(this).hide();
					});
				};
			});
			domRoot.input.on('keypress', function(evt){
				if(evt.keyCode === 13 && $(evt.target).val().length) {
					const search = $(evt.target).val().toLowerCase();
					const orgArray = fastSearchFilter.customList;
					let result = [];

					for(let i = 0, len = orgArray.length; i<len; i++){
						if (orgArray[i].name.toLowerCase().indexOf(search)>= 0) result.push({name: orgArray[i].name, index: i});
					}
					if(this.selectedCollection.indexOf(result[0].name)<0){
						this.selectedCollection.push(result[0].name);
						domRoot.ul.children().eq(result[0].index).addClass('selected');
						this.updateItems();
					};

					$(evt.target).val('');
				};
			}.bind(this));
		}

		selectItemAction(evt){
			let target = evt.target;
			if(Array.prototype.indexOf.call(target.classList, 'selected') < 0){
				target.classList.add('selected');
				this.selectedCollection.push(target.innerText);
			}
			else{
				target.classList.remove('selected');
				this.selectedCollection = this.getItemStorage(this.selectedCollection, target.innerText);
				domRoot.input.val('');
				// this.selectedCollection = this.selectedCollection.filter(function(value){
				// 	return value !== this
				// }, target.innerText);

			}
			this.updateItems();
			console.log(this.selectedCollection);			
		}

		renderList(){
			let _that = this;
			domRoot.select.html(fastSearchFilter.customList.map((data) => `<option value=${data.value}>${data.name}</option>`));
			domRoot.ul.html(fastSearchFilter.customList.map((data) => `<li class="txt-item">${data.name}</li>`));
			
		}
		
		updateItems(){
			if(this.selectedCollection.length) this.createItemTags(this.selectedCollection);
			else this.cleanAllSelection();
		}

		createItemTags(dataArray = []){
			let tagCollection = [];
			this.cleanAllSelection();
			tagCollection = dataArray.map(function(item, i){
				return `<div class="txt-select-item" data-idx=${i}>
							<button class="removebtn" type="button">X</button>${item}
						</div>`;
			});
			domRoot.listArea.prepend(tagCollection);
		}
		
		removeTags(evt){
			let text = evt.target.nextSibling.data.replace(/\s/g, '');
			evt.stopPropagation();

			this.selectedCollection = this.getItemStorage(this.selectedCollection, text);
			this.updateItems();
			$('.selected').map(function(i, v){
				if($(v).text() === text) $(this).removeClass('selected');
			})
		}

		cleanAllSelection(){
			$('.txt-select-item').remove();
			domRoot.input.css('width', '100%');
		}
		
		getItemStorage(allItem, removeItem){
			let map = {}, storage = [];
			
			for (let i = allItem.length; i--;) {
				if (allItem[i] !== removeItem) {
					storage.push(allItem[i]);
				}
			}
			return storage.reverse();
		}

		set customList(listArr = [{name: '', value: ''}]){
			fastSearchFilter.customList = listArr;
			if(fastSearchFilter.customList.length) this.renderList();
			else console.log('查詢無資料');
		}		
		get export(){
			return this.selectedCollection;
		}
	}

	Object.defineProperty(fastSearchFilter, 'customList', {
		value: [{name: '項目一', value: 'xxx'}, {name: '項目二', value: 'ddd'}, {name: '項目三', value: 'eee'}, {name: '項目四', value: 'ccc'}, {name: '最後一項', value: 'nnn'}],
		readable: true,
		writable: true,
		enumerable: false,
		configurable: false
	})
	
	var selectStruct = new fastSearchFilter();
	//自訂搜尋下拉欄位 
	selectStruct.customList = [{name: 'Articuno', value: 'xxx'}, {name: 'Arcanine', value: 'ddd'}, {name: 'Suicune', value: 'eee'}, {name: 'Poliwhirl', value: 'ccc'}, {name: 'Ditto', value: 'ddd'}];

	// 匯出選取值
	$('#clickme').on('click', function(){
		$('#showselect').text(selectStruct.export);
	})
	
}(window, document);