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
			var intRegex = /^\d+$/;
			var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
			
			// namespace for form object
			var form = {
				
				error: "",
				
				// validate required fields
				checkrequired: function(input) {	
					if ($(input).val() == "" || $(input).val().length == 0) {
						form.error = $(input).attr('name') + " is a requird field.";
						$(input).focus();
						return false;
					}
					return true;
				},
				
				// validate max length
				checkmaxlength: function(input, value) {
					
					if ($(input).val().length > value) {
						form.error = $(input).attr('name') + " can only be " + value + " characters long.";
						$(input).focus();
						return false;
					}
					return true;
				},
				
				// validate min length
				checkminlength: function(input, value) {
					if ($(input).val().length < value) {
						form.error = $(input).attr('name') + " must be at least " + value + " character(s) long.";
						$(input).focus();
						return false;
					}
					return true;
				},
				
				// validate number
				checknumber: function(input) {
					if (!intRegex.test($(input).val()) || !floatRegex.test($(input).val())) {
						form.error = $(input).attr('name') + " must be a number";
						$(input).focus();
						return false;
					}
					return true;
				},
				
				// validate integer
				checkinteger: function(input) {
					if (!intRegex.test($(input).val())) {
						form.error = $(input).attr('name') + " must be an integer";
						$(input).focus();
						return false;
					}
					return true;
				},
				
				// validate range
				checkrange: function(input, range) {
					if (form.checknumber(input, $(input).val())) {
						var min = range.substr(0,range.indexOf('-'));
						var max = range.substr(range.indexOf('-')+1);
						if ($(input).val() > min || $(input).val() < max) {
							form.error = $(input).attr('name') + " must be a number between " + min + " and " + max;
							$(input).focus();
							return false;
						}
					}
					return true;
				},
				
				// validate email
				checkemail: function(input) {
					
				},
				
				// validate phone
				checkphone: function(input) {
				
				},
				
				// validate regex
				checkexpression: function(input, regex) {
				
				},
				
				// initialize form object
				init: function() {
					var pass = true;
					form.error = "";
					$(obj).find(o.class).each(function() {
						var args = $(this).attr('data-validate').split(",");
						for (var i = 0; i < args.length; i++) {
							if (args[i].indexOf("=") == -1) {
								pass = form['check' + args[i]](this);
							} else {
								pass = form['check' + args[i].substr(0, args[i].indexOf('='))](this, args[i].substr(args[i].indexOf('=')+1));
							}
						}
						return pass;
					});
					form.showError();
					return pass;
				},
				
				// show error
				showError: function() {
					$(obj).prepend("<p>" + form.error + "</p>");
				}
				
			}
			
			$(obj).submit(function() {
				return false;
				/* normal event when not testing
				if (!form.init()) {
					form.showError();
					return false;
				}*/
			});
			
			// currently testing
			$('.submit').click(function() {
				form.init();
			});
		
		});
		
	}
})(jQuery);