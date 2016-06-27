Scratcher = (function(){

	function getEventCoords(ev){
		var touchev, coords={};
		var origev=ev.originalEvent;

		if (origev.changedTouches != undefined){
			touchev = origev.changedTouches[0];
			coords.pageX = touchev.pageX;
			coords.pageY = touchev.pageY;
		}else {
			coords.pageX = ev.pageX;
			coords.pageY = ev.pageY;
		}
		return coords;
	}

	function getLocalcoords(elem, coords){
		var offset = $(elem).offset();
		return { 'x': coords.pageX - offset.left, 'y': coords.pageY - offset.top};
	}

	function Scratcher(cvsId){
		this.cvsinfo = { 
					'main': document.getElementById(cvsId),
					'temp': null,
					'draw': null
				};
		this.mouseDown = false;
		this.cvsid = cvsId;
		this._initialCanvas();
		this.setupImage();
		this._eventListeners={};
	}

	Scratcher.prototype.setupImage = function(){
		this.imagebox = {
				'front': {'url': './images/Articuno2.png', 'img': null},
				'back': {'url': './images/Articuno1.png', 'img': null}
			}
		
		this._imageLoaded();
	}

	Scratcher.prototype._imageLoaded = function(){
		var loadCount = 0;
		
		function imageLoaded(e){
			loadCount++;

			if(loadCount >= 2){
				this.dispatchEvent(this.createEvent('imagesLoaded'));
				this.reset();
			}
		}

		for (k in this.imagebox) if(this.imagebox.hasOwnProperty(k)){
			this.imagebox[k].img=document.createElement('img');
			$(this.imagebox[k].img).on('load', imageLoaded.bind(this));
			this.imagebox[k].img.src=this.imagebox[k].url;
		}
	}

	Scratcher.prototype.recompositeCanvases = function(){
		var tempctx= this.cvsinfo.temp.getContext('2d');
				mainctx= this.cvsinfo.main.getContext('2d');

				this.cvsinfo.temp.width=this.cvsinfo.temp.width;

				tempctx.drawImage(this.cvsinfo.draw, 0, 0);

				tempctx.globalCompositeOperation = 'source-atop';
				tempctx.drawImage(this.imagebox.back.img, 0, 0);

				mainctx.drawImage(this.imagebox.front.img, 0, 0);

				mainctx.drawImage(this.cvsinfo.temp, 0, 0);

	}

	Scratcher.prototype.scratchLine = function(x, y, fresh){
		var canvas = this.cvsinfo.draw,
				ctx = canvas.getContext('2d');

		ctx.lineWidth = 45;
		ctx.lineCap = ctx.lineJoin = 'round';
		ctx.strokeStyle = '#fff';
		if (fresh){
			ctx.moveTo(x+0.01, y);
		}
		ctx.lineTo(x, y);
		ctx.stroke();

		this.dispatchEvent(this.createEvent('scratch'));
	}

	Scratcher.prototype._initialCanvas = function(){
		var canvas=this.cvsinfo.main;

		this.cvsinfo.temp= document.createElement('canvas');
		this.cvsinfo.draw= document.createElement('canvas');
		this.cvsinfo.temp.width=this.cvsinfo.draw.width=canvas.width;
		this.cvsinfo.temp.height=this.cvsinfo.draw.height=canvas.height;

		function drawstart_handler(e){
			var local = getLocalcoords(canvas, getEventCoords(e));
			this.mouseDown=true;

			this.scratchLine(local.x, local.y, true);
			this.recompositeCanvases();

			this.dispatchEvent(this.createEvent('scratchesbegan'));

			return false;
		}

		function drawmove_handler(e){
			if(!this.mouseDown) return true;

			var local = getLocalcoords(canvas, getEventCoords(e));

			this.scratchLine(local.x, local.y, true);
			this.recompositeCanvases();

			return false;
		}

		function drawdone_handler(){
			if (this.mouseDown) {
				this.mouseDown = false;
				this.dispatchEvent(this.createEvent('scratchesended'));

				return false;
			}
			return true;
		}

		$(canvas).on('mousedown touchstart', drawstart_handler.bind(this));
		$(document).on('mousemove', drawmove_handler.bind(this));
		$(document).on('touchmove', drawmove_handler.bind(this));
		$(document).on('mouseup', drawdone_handler.bind(this));
		$(document).on('touchend', drawdone_handler.bind(this));
	}

	Scratcher.prototype.reset = function(){
		this.cvsinfo.draw.width = this.cvsinfo.draw.width;
		this.recompositeCanvases();
	}

	Scratcher.prototype.fullAmount = function(stride) {
		var i, l;
		var can = this.cvsinfo.draw;
		var ctx = can.getContext('2d');
		var count, total;
		var pixels, pdata;

		if (!stride || stride < 1) { stride = 1; }

		stride *= 4; // 4 elements per pixel

		pixels = ctx.getImageData(0, 0, can.width, can.height);
		pdata = pixels.data;
		l = pdata.length; // 4 entries per pixel

		total = (l / stride)|0;

		for (i = count = 0; i < l; i += stride) {
			if (pdata[i] != 0) {
				count++;
			}
		}

		return count / total;
	};

	Scratcher.prototype.createEvent = function(type){
		var evt = {
			'type': type,
			'target': this,
			'currentTarget': this
		};
		return evt;
	}

	Scratcher.prototype.addEventListener = function (type, handler) {
		var el = this._eventListeners;
		    type = type.toLowerCase();

    if (!el.hasOwnProperty(type)) {
		  el[type] = [];
		}

		if (el[type].indexOf(handler) == -1) {
		  el[type].push(handler);
		}
	};

  Scratcher.prototype.removeEventListener = function(type, handler) {
    var el = this._eventListeners;
    var i;

    type = type.toLowerCase();

    if (!el.hasOwnProperty(type)) { return; }
    if (handler) {
      if ((i = el[type].indexOf(handler)) != -1) {
        el[type].splice(i, 1);
      }
    } else el[type] = [];
  };

	Scratcher.prototype.dispatchEvent = function(evt){
		var el = this._eventListeners,
				i, len,
				type = evt.type.toLowerCase();

		if (!el.hasOwnProperty(type)) { return; }

		len = el[type].length;

		for(i = 0; i < len; i++) {
			el[type][i].call(this, evt);
		}
	}

	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			if (typeof this !== "function") {
				// closest thing possible to the ECMAScript 5 internal
				// IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var aArgs = Array.prototype.slice.call(arguments, 1), 
					fToBind = this, 
					fNOP = function () {},
					fBound = function () {
						return fToBind.apply(this instanceof fNOP
						     ? this
						     : oThis || window,
						     aArgs.concat(Array.prototype.slice.call(arguments)));
					};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}

	return Scratcher;
})();