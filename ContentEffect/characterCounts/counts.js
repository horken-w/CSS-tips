!function(document, window){
	'use strict';
	var textarea = Array.prototype.slice.call(document.getElementsByTagName('textarea'));

	function addEvent(obj,evt,fn) {
		if (obj.addEventListener)
			obj.addEventListener(evt, fn, false);
		else if (obj.attachEvent)
			obj.attachEvent('on'+evt, fn);
	}

	function validateChacter(keycode){
		var checked = false;

		checked = 
		(keycode > 47 && keycode < 58)   || // number
        keycode == 32 || keycode == 13   || // spacebar & enter
        (keycode > 64 && keycode < 91)   || // letter
        (keycode > 95 && keycode < 112)  || // numpad
        (keycode > 185 && keycode < 193) || // ;=,-./`
        (keycode > 218 && keycode < 223) || // [\]'
        keycode == 8;  						// backspace

		return checked;
	}

	function textCounts(evt){
		var max = this.maxLength, isChrome = window.chrome;

		if(isChrome) 
			if(validateChacter(evt.keyCode) && this.value.length <= max)
				this.nextElementSibling.innerText = max - this.value.replace(/\r(?!\n)|\n(?!\r)/g, '\r').length;

		else if(validateChacter(evt.keyCode) && this.value.length <= max)
			this.nextElementSibling.innerText = max - this.value.length;
		// else
		// 	this.value = this.value.slice(0, -1); //remove last chacter;

		dynamicGroup(evt.target)
	}

	function dynamicGroup(target){
		if (target.scrollHeight > 115){
		 	target.style.height = "2px";
    		target.style.height = target.scrollHeight + "px";
		}
	}

	function setRemainArea(node){
		var span = document.createElement('span'), root = node.parentElement;
		span.classList.add('highlight');
		span.innerText = node.maxLength;
		root.appendChild(span);
	}

	function textRemain(domEl) {
		domEl.forEach(function(i, v) {
			setRemainArea(i);
			addEvent(i, 'keyup', textCounts)
			console.log(i);
	    })
	}


	textRemain(textarea);
}(document, window)