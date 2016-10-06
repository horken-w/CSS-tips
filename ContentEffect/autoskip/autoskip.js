(function($){
    $.fn.autoSkip = function(){
        var defaults = {
            _self: this,
            date: false
        }
        init();

        function init(element){
            var target = defaults._self;
            target.find('input:first').focus();
            options=$.extend({}, defaults, defaults._self.data());

            options._self.find('input').on('keydown', fullInputbox);
            options._self.find('input').on('keyup', function(){
                detectedProcessing(this);
            })
        }

        function detectedProcessing(element){
            var maxlength = $(element).attr('maxlength'), currect =$(element).val().length;
            if(currect >= maxlength) $(element).next().focus();
        }

        function fullInputbox(evt){
            var data='';
            if(options.date){
                if(evt.keyCode === 9 || evt.keyCode === 13){
                    for(var i=0, len=this.maxLength-this.value.length; i<len; i++){
                        data +='0';
                    }
                    this.value = data+=this.value;
                }
            }                    
        }
    }
})(jQuery)