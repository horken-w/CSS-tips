!function(window, document){
	'user strict';
	var min_column=3, flowindex=0;
	var column_width=240, gap_width=15, gap_height=15;
	var managing = false, loading=false;
	var columheights, scrollDelay, columnCount;

	var wrapper = document.getElementById('container');

	var addEvent = function(element, type, handler) {
	  if(element.addEventListener) {
	    addEvent = function(element, type, handler) {
	      element.addEventListener(type, handler, false);
	    };
	  } else if(element.attachEvent) {
	    addEvent = function(element, type, handler) {
	      element.attachEvent('on' + type, handler);
	    };
	  } else {
	    addEvent = function(element, type, handler) {
	      element['on' + type] = handler;
	    };
	  }
	  addEvent(element, type, handler);
	};

	var getColumnCount= function(){
		return Math.max(min_column, Math.floor((document.body.offsetWidth+gap_width)/(column_width+gap_width)));
	};
	var getMinVal=function(arr){
		return Math.min.apply(Math, arr);
	};
	var getMaxVal=function(arr){
		return Math.max.apply(Math, arr);
	};
	var getMinkey=function(arr){
		var key=0;
		var min=arr[0];

		for(var i=0, l=arr.length; i<l; i++){
			if(min > arr[i]){
				key=i;
				min=arr[i];
			}
		}
		return key;
	};
	var getMaxVal=function(arr){
		var key, max=arr[0];

		for(var i=0, l=arr.length; i<l; i++){
			if(max < arr[i]){
				key=i;
				max=arr[i];
			}
		}
		return key;
	};
	var managetiles=function(){
		managing = true;
		var flows=wrapper.children;
		var viewportTop=(document.body.scrollTop || document.documentElement.scrollTop)- wrapper.offsetTop;
		var viewporBottom= (window.innerHeight || document.documentElement.clientHeight) +viewportTop;

		if(viewporBottom > getMinVal(columheights)) appendtiles(columnCount);
		managing = false;
	};
	var appendtiles=function(count){
		if(loading) {
	      return;
	    }
	    var fragment = document.createDocumentFragment();
	    var tiles=[];
	    for(var i=0; i<count; i++ ){
	    	tiles.push(wrapper.children[flowindex]);
	    	flowindex++;
	    }
	    setTimeout(function() {
	      loading=false
	      wrapper.appendChild(fragment);
	      adjusttiles(tiles);
	    }, 1000);
	};
	var adjusttiles=function(flows, reflow){
		var columnIndex;
    	var columnHeight;

    	for(var i=0, l=flows.length; i<l; i++){
    		columnIndex=getMinkey(columheights);
    		columnHeight=columheights[columnIndex];

    		$(flows[i]).css({
    			left: columnIndex*(column_width+gap_width)+'px',
    			top: columnHeight+'px'
    		}).removeClass('pending').addClass('ready');
    		columheights[columnIndex]=columnHeight + gap_height + flows[i].offsetHeight;
    	}
    	wrapper.style.height = getMaxVal(columheights) + 'px';
    	managetiles(flows.length);
	}
	var resetHeights=function(count){
		columheights=[];
		for(var i=0; i<count; i++){
			columheights.push(0);
		}
		wrapper.style.width=(count *(column_width+gap_width)-gap_width)+'px';
	};
	var reflowtiles=function(){
		columnCount = getColumnCount();
		if(columheights.length != columnCount){
			resetHeights(columnCount);
			adjusttiles(wrapper.children);
		}else managetiles();
	};

	var delayedResize=function(){
		clearTimeout(scrollDelay);
		scrollDelay=setTimeout(reflowtiles ,500)
	};
	var delayedScroll=function(){
		clearTimeout(scrollDelay);
		if(!managing){
			scrollDelay=setTimeout(managetiles ,500)
		}
	};
	var init = function() {
	    addEvent(window, 'resize', delayedResize);
	    addEvent(window, 'scroll', delayedScroll);

	    columnCount = getColumnCount();
	    resetHeights(columnCount);

	    managetiles();
	  };
	addEvent(window, 'load', init);
}(window, document)