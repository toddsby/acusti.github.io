'use strict';

var isSupported   = window.requestAnimationFrame !== undefined,
    isListening   = false,
    scrollY       = window.pageYOffset,
	callbackQueue = [],
    checkForScroll,
	initScrollChecking,
    attachScrollYFrame;

checkForScroll = function() {
	var i;
	// Set up next cycle
	window.requestAnimationFrame(checkForScroll);

	if (scrollY === window.pageYOffset) {
		return;
	}
	scrollY = window.pageYOffset;

	for (i = 0; i < callbackQueue.length; i++) {
		callbackQueue[i](scrollY);
	}
};

initScrollChecking = function() {
	if (window.pageYOffset <= 0) {
		return;
	}
	window.requestAnimationFrame(checkForScroll);
	window.removeEventListener('scroll', initScrollChecking);
	document.body.removeEventListener('touchmove', initScrollChecking);
};

attachScrollYFrame = function(callback) {
	if (!isSupported) {
		return;
	}
	if (!isListening) {
		window.addEventListener('scroll', initScrollChecking);
		document.body.addEventListener('touchmove', initScrollChecking);
		isListening = true;
	}
	callbackQueue.push(callback);
};

export default attachScrollYFrame;
