// JQuery Session Timeout Manager																				//
// Description: Shows a dialog using JQuery Confirm to alert the user before their session   //
// 				 times out.																							//
//																															//
//	Created By: (C) Studio7 Web Development 2018																//
///////////////////////////////////////////////////////////////////////////////////////////////

if (typeof jQuery === 'undefined') {
	throw new Error('jquery-sessionTimeoutManager requires jQuery');
}

if (typeof jconfirm === 'undefined') {

	throw new ReferenceError('jquery-sessionTimeoutManager requires jConfirm. See Documentation.');
}

var tmrSTM;
var timeoutInterval;
var thisInterval;
var opts;

(function ($) {
	"use strict";
	$.fn.sessionTimeoutManager = function (options) {

		opts = $.extend({}, $.fn.sessionTimeoutManager.defaults, options);


		this.initialize = function () {
			console.info("Plugin Initialised");
			console.info("'" + opts.confirmColor + "'");
			console.log(opts.redirectToURL);
			timeoutInterval = Math.floor(opts.sessionActualTimeout - opts.warnUserBeforeDuration);
			thisInterval = Math.floor(timeoutInterval / 1000 / 60) + "Minute(s)";

			console.log("opts.elementToHook: " + opts.elementToHook);
			if (opts.elementToHook === document) {
				document.addEventListener("mousemove", this.resetTimer());
			} else {
				document.getElementById(opts.elementToHook).addEventListener("mousemove", this.resetTimer());
			}

			this.startTimer();

			return this;
		};

		this.startTimer = function () {

			tmrSTM = setTimeout(function () {

				//Show user a dialog using the jconfirm plugin if option->warnUserWithDialog is true
				if (opts.warnUserWithDialog) {

					$.alert({
						theme: 'material',
						icon: opts.confirmIcon,
						title: opts.confirmTitle,
						content: opts.confirmText,
						type: opts.confirmColor,
						columnClass: 'col-md-6 col-md-offset-3',
						autoClose: "cancel|60000",
						buttons: {
							confirm: {
								text: opts.confirmButtonText,
								action: opts.confirmAction
							},
							cancel: {
								text: opts.cancelButtonText,
								action: opts.cancelAction
							}
						}
					});

				} else {
					document.location.href = opts.redirectToURL;
				}

			}, timeoutInterval);
			//console.log("Timer Started");
		};

		this.stopTimer = function () {

			clearTimeout(tmrSTM);
			console.log("Timeout Stopped");
		};

		this.resetTimer = function () {
			clearTimeout(tmrSTM);
			this.startTimer();
			console.log("Timeout Reset");
		};


		return this.initialize();
	};


	// Plugin defaults
	$.fn.sessionTimeoutManager.defaults = {
		sessionActualTimeout: 1500000,
		warnUserWithDialog: true,
		redirectToURL: document.location.href,
		warnUserBeforeDuration: 650000,
		elementToHook: document,
		confirmTitle: '&nbsp;Session Timeout Warning.',
		confirmIcon: 'fas fa-exclamation-circle',
		confirmColor: 'red',
		confirmText: 'To keep your data safe your session will timeout in 60 seconds<br/>We take your security very seriously and as a result have implemented and inactivity timeout.<br></br> Click "Stay Signed In" to keep your session active.<br/><br/>Do you wish to stay signed in? When this dialog auto closes you will be signed out.',
		confirmButtonText: '<i class="fas fa-times-circle"></i>&nbsp;Stay Signed In',
		cancelButtonText: '<i class="fas fa-times-circle"></i>&nbsp;Log Out',
		confirmAction: function () {

			this.resetTimer();

		},
		cancelAction: function () {

			document.location.href = opts.redirectToURL;

		}
	};

})(jQuery, window);
