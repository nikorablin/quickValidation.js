(function($){
	 $.fn.quickValidate = function(options) {
		
		// defaults
		var defaults = {
			class: ".quickValidate",
			errorRequired: "$name is a required field",
			errorMaxlength: "$name can only be $value characters long",
			errorMinlength: "$name must be at least $value character(s) long",
			errorNumber: "$name must be a number",
			errorInteger: "$name must be an integer",
			errorRange: "$name must be between $min and $max",
			errorEmail: "$name must be a valid email address",
			errorPhone: "$name must be a valid phone number",
			errorExpression: "$name is not valid",
			notificationClass: ".notification",
			errorClass: ".error",
			debug : false
		}
		
		var options = $.extend(defaults, options);
		
		return this.each(function() {
			
			// set vars
			var o = options;
			var obj = this;
			var notification = $(document).find(o.notificationClass);
			var intRegex = /^\d+$/;
			var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
			var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
			var emailRegex = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
			
			$(notification).hide();
			
			function capitalize(string) {
			    return string.charAt(0).toUpperCase() + string.slice(1);
			}
			
			// namespace for form object
			var form = {
				
				// initialize error message
				error: "",
				
				// get error message
				getErrorMessage: function(input, type, value, min, max) {
					value = typeof value !== 'undefined' ? value : null;
					min = typeof min !== 'undefined' ? min : null;
					max = typeof max !== 'undefined' ? max : null;
					return o['error' + capitalize(type)].replace('$name', $(input).attr('data-name')).replace('$value', value).replace('$min', min).replace('$max', max);
				},
				
				// validate required fields
				checkrequired: function(input) {	
					if ($(input).val() == "" || $(input).val().length == 0) {
						form.error = form.getErrorMessage(input, 'required');
						$(input).focus();
						return false;
					}
					return true;
				},
				
				// validate max length
				checkmaxlength: function(input, value) {
					
					if ($(input).val().length >= value) {
						form.error = form.getErrorMessage(input, 'maxlength', value);
						$(input).focus();
						return false;
					}
					return true;
				},
				
				// validate min length
				checkminlength: function(input, value) {
					if ($(input).val().length <= value && $(input).val() != "") {
						form.error = form.getErrorMessage(input, 'minlength', value);
						$(input).focus();
						return false;
					}
					return true;
				},
				
				// validate number
				checknumber: function(input) {
					if (!intRegex.test(($(input).val()) || !floatRegex.test($(input).val())) && $(input).val() != "") {
						form.error = form.getErrorMessage(input, 'number');
						$(input).focus();
						return false;
					}
					return true;
				},
				
				// validate integer
				checkinteger: function(input) {
					if (!intRegex.test($(input).val()) && $(input).val() != "") {
						form.error = form.getErrorMessage(input, 'integer');
						$(input).focus();
						return false;
					}
					return true;
				},
				
				// validate range
				checkrange: function(input, range) {
					if (form.checknumber(input, $(input).val()) && $(input).val() != "") {
						form.error = form.getErrorMessage(input, 'range', null, min, max);
						var min = range.substr(0,range.indexOf('-'));
						var max = range.substr(range.indexOf('-')+1);
						if (parseFloat($(input).val()) < min || parseFloat($(input).val()) > max) {
							form.error = form.getErrorMessage(input, 'range', null, min, max);
						} else {
							return true;
						}
						$(input).focus();
						return false;
					} else {
						form.error = form.getErrorMessage(input, 'number');
						$(input).focus();
						return false;
					}
				},
				
				// validate email
				checkemail: function(input) {
					if (!emailRegex.test($(input).val()) && $(input).val() != "") {
						form.error = form.getErrorMessage(input, 'email');
						$(input).focus();
						return false;
					}
					return true;
				},
				
				// validate phone
				checkphone: function(input) {
					if (!phoneRegex.test($(input).val()) && $(input).val() != "") {
						form.error = form.getErrorMessage(input, 'phone');
						$(input).focus();
						return false;
					}
					return true;
				},
				
				// validate regex
				checkexpression: function(input, value) {
					var regex = new RegExp(value);
					if (!regex.test($(input).val) && $(input).val() != "") {
						form.error = form.getErrorMessage(input, 'expression');
						$(input).focus();
						return false;
					}
					return true;
				},
				
				checkradio: function(input) {
					var name = $(input).attr('name');
					$(obj).find('input[name=' + name + "]").each(function() {
						console.log($(this).val());
					});
					if (!$(input).val()) {
						return false;
					}
					return false;
				},
				
				// initialize form object
				init: function() {
					var pass = true;
					form.error = "";
					$(obj).find(o.class).each(function(e) {
						if ($(this).attr('data-validate')) {
							var args = $(this).attr('data-validate').split(",");
							for (var i = 0; i < args.length; i++) {
								if (args[i].indexOf("=") == -1) {
									pass = form['check' + args[i]](this);
								} else {
									pass = form['check' + args[i].substr(0, args[i].indexOf('='))](this, args[i].substr(args[i].indexOf('=')+1));
								}
								if (!pass)
									return pass;
							}
						}
					});
					return pass;
				},
				
				// show error
				showError: function() {
					$(notification).find(o.errorClass).html(form.error);
					$(notification).show();
				}
				
			}
			
			$(obj).submit(function() {
				if (!form.init()) {
					form.showError();
					return false;
				} else if (o.debug) {
					$(notification).find('h2').html("Congtraulations!");
					$(notification).find(o.errorClass).html("You have successfully validated a form, tell your friends.");
					$(notification).show();
					return false;
				}
				return true;
			});
			
		});
		
	}
})(jQuery);