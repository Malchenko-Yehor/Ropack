/* eslint-disable spaced-comment */
/*!
{
  "name": "mobiledevice",
  "property": "mobiledevice"
}
!*/

define(['Modernizr', 'tests', 'prefixes', 'testStyles'], function (Modernizr, tests, prefixes, testStyles) { // eslint-disable-line no-undef
	/**
	 * Определение мобильных устройств
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name mobiledevice
	 */
	Modernizr.addTest('mobiledevice', function () {
		var toucheventsTest = tests.filter(function (test) {
			return test.name === 'touchevents';
		});
		if (toucheventsTest) {
			var touch = toucheventsTest[0].fn();
			var ua = window.navigator.userAgent.toLowerCase();
			return touch && !!((~ua.indexOf('iphone') || ~ua.indexOf('ipod') || ~ua.indexOf('ipad') || ~ua.indexOf('android')) || (/\sEdgA\//i.test(ua) || /\sEdgiOS\//i.test(ua) || /Windows\sPhone/i.test(ua)));
		}
		console.warn('Modernizr test mobiledevice require touchevents');
		return false;
	});
});
