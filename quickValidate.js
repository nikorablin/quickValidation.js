(function($){
	 $.fn.quickValidate = function(options) {
		
		// defaults
		var defaults = {
			class: ".quickValidate"
		}
		
		var options = $.extend(defaults, options);
		
		return this.each(function() {
			
			// set vars
			var o = options;
			var obj = this;
			
			// namespace for form object
			var form = {
				
				// validate required fields
				checkrequired: function(input) {
					if ($(input).val() == "" || $(input).val().length == 0) {
						console.log('failed');
						return false;
					}
					return true;
				},
				
				// validate max length
				checkmaxlength: function(input, value) {
					if ($(input).val().length > value) {
						console.log('failed');
						return false;
					}
					console.log('passed');
					return true;
				},
				
				// validate min length
				checkminlength: function(input, value) {
					if ($(input).val().length < value) {
						console.log('failed');
						return false;
					}
					console.log('passed');
					return true;
				},
				
				// validate integer
				checkinteger: function(input) {
					
				},
				
				// initialize form object
				init: function() {
					var pass = true;
					$(obj).find(o.class).each(function() {
						var args = $(this).attr('data-validate').split(",");
						for (var i = 0; i < args.length; i++) {
							if (args[i].indexOf("=") == -1)
								var pass = form['check' + args[i]](this);
							else {
								var pass = form['check' + args[i].substr(0, args[i].indexOf('='))](this, args[i].substr(args[i].indexOf('=')+1)); 
							}	
						}
					});
					return pass;
				}
				
			}
			
			$('form').submit(function(e) {
				form.init();
			});
		
		});
		
	}
})(jQuery);