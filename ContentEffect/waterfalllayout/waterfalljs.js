!function(window, document){
	// ES5 strict mode
  	"user strict";

  	var min_column_count = 3;
  	var gap_width = 15;
  	var gap_height= 15;
  	var column_width= 240;
  	var cell_padding=28;

  	var columnHeight
  	var scrollDelay;
  	var columnCount;
  	var managing = false, loading=false;

  	var cellsContainer = document.getElementById('container');

  	// Cross-browser compatible event handler.
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
		return Math.max(min_column_count, Math.floor(document.body.offsetWidth+gap_width)/(column_width+gap_width));
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
	var adjustCells=function(flows){
		var columnIndex;
    	var columnHeight;

    	for(var i=0, l=flows.length; i<l; i++){
    		columnIndex=getMinkey(columnHeights);
    		columnHeight=columnHeights[columnIndex];

    		$(flows[i]).css({
    			left: columnIndex*(column_width+gap_width)+'px',
    			top: columnHeight+'px'
    		}).addClass('ready');
    		columnHeights[columnIndex]=columnHeight + gap_height + flows[i].offsetHeight;
    	}
	}
	var resetHeights= function(count){
		columnHeights=[];
		for(var i=0; i<count; i++){
			columnHeights.push(0);
		}
		cellsContainer.style.width= (count * (column_width+gap_width)-gap_width)+'px';
	};
	var appendCells=function(){
		if(loading) {
	      return;
	    }
	    var fragment = document.createDocumentFragment();
	    var cells=[];
	    for(var i=0; i<cellsContainer.children.length; i++ ){
	    	cells.push(cellsContainer.children[i]);
	    }
	    setTimeout(function() {
	      loading=false;
	      cellsContainer.appendChild(fragment);
	      adjustCells(cells);
	    }, 2000);
	}
	var manageCells = function(){
		managing=true;

		var flow=cellsContainer.children;
		var viewportTop=(document.body.scrollTop || document.documentElement.scrollTop)- cellsContainer.offsetTop;
		var viewporBottom= (window.innerHeight || document.documentElement.clientHeight) +viewportTop;

		if(viewporBottom > getMinVal(columnHeights)) appendCells(columnCount);
		managing=false;
	};
	var delayedResize= function(){
		clearTimeout(scrollDelay);
		scrollDelay=setTimeout(manageCells ,0)
	};
	var delayedScroll= function(){

	};

	var init = function() {
	    // Add other event listeners.
	    addEvent(window, 'resize', delayedResize);
	    addEvent(window, 'scroll', delayedScroll);

	    // Initialize array of column heights and container width.
	    columnCount = getColumnCount();
	    resetHeights(columnCount);

	    // Load cells for the first time.
	    manageCells();
	  };

  	// Ready to go!
	addEvent(window, 'load', init);
}(window, document)