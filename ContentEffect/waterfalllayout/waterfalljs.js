!function(window, document){
	'user strict';
	let min_column=3, flowindex=0;
	let column_width=240, gap_width=15, gap_height=15;
	let managing = false, loading=false;
	let columheights, scrollDelay, columnCount;

	const wrapper = document.getElementById('container');

	const addEvent = function(element, type, handler) {
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

	const getColumnCount=function(){
		return Math.max(min_column, Math.floor((document.body.offsetWidth+gap_width)/(column_width+gap_width)));
	};
	const getMinVal=function(arr){
		return Math.min.apply(Math, arr);
	};
	const getMaxVal=function(arr){
		return Math.max.apply(Math, arr);
	};
	const getMinkey=function(arr){
		let key=0;
		let min=arr[0];

		for(let i=0, l=arr.length; i<l; i++){
			if(min > arr[i]){
				key=i;
				min=arr[i];
			}
		}
		return key;
	};
	const getMaxVal=function(arr){
		let key=0, max=arr[0];

		for(let i=0, l=arr.length; i<l; i++){
			if(max < arr[i]){
				key=i;
				max=arr[i];
			}
		}
		return max;
	};
	const managetiles=function(){
		managing = true;
		let flows=wrapper.children;
		let viewportTop=(document.body.scrollTop || document.documentElement.scrollTop)- wrapper.offsetTop;
		let viewporBottom= (window.innerHeight || document.documentElement.clientHeight) +viewportTop;

		if(viewporBottom > getMinVal(columheights)) appendtiles(columnCount);
		managing = false;
	};
	const appendtiles=function(count){
		if(loading) return;
		
	    var tiles=[];
	    for(var i=0; i<count; i++ ){
	    	tiles.push(wrapper.children[flowindex]);
	    	flowindex++;
	    }
	    setTimeout(function() {
	      loading=false;
	      adjusttiles(tiles);
	    },500);
	};
	const adjusttiles=function(flows, reflow){
		var columnIndex;
    	var columnheight;

    	for(var i=0, l=flows.length; i<l; i++){
    		if(flows[i] !== undefined){
    			columnIndex=getMinkey(columheights);
	    		columnheight=columheights[columnIndex];

	    		$(flows[i]).css({
	    			height: (flows[i].offsetHeight-28)+'px',
	    			left: columnIndex*(column_width+gap_width)+'px',
	    			top: columnheight+'px'
	    		}).removeClass('pending').addClass('ready');
	    		columheights[columnIndex]=columnheight + gap_height + flows[i].offsetHeight;
    		}else return;
    		
    	}
    	wrapper.style.height = getMaxVal(columheights) + 'px';
    	managetiles(flows.length);
	}
	const resetHeights=function(count){
		columheights=[];
		for(var i=0; i<count; i++){
			columheights.push(0);
		}
		wrapper.style.width=(count *(column_width+gap_width)-gap_width)+'px';
	};
	const reflowtiles=function(){
		columnCount = getColumnCount();
		if(columheights.length != columnCount){
			resetHeights(columnCount);
			adjusttiles(wrapper.children);
		}else managetiles();
	};

	const delayedResize=function(){
		clearTimeout(scrollDelay);
		scrollDelay=setTimeout(reflowtiles ,0)
	};
	const delayedScroll=function(){
		clearTimeout(scrollDelay);
		if(!managing){
			scrollDelay=setTimeout(managetiles ,500)
		}
	};
	const init = function() {
	    addEvent(window, 'resize', delayedResize);
	    addEvent(window, 'scroll', delayedScroll);

	    columnCount = getColumnCount();
	    resetHeights(columnCount);

	    managetiles();
	  };
	addEvent(window, 'load', init);
}(window, document)