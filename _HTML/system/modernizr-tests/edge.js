/* eslint-disable spaced-comment */
/*!
{
  "name": "edge",
  "property": ["edge", "edge-ios", "edge-android"]
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение **Edge** браузера
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name edge
	 */
	Modernizr.addTest('edge', (window.navigator.userAgent.indexOf(' edge/') > 0));

	/**
	 * Определение **Edge iOS** браузера
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name edge-ios
	 */
	Modernizr.addTest('edge-ios', (/\sEdgiOS\//i.test(window.navigator.userAgent)));

	/**
	 * Определение **Edge Android** браузера
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name edge-android
	 */
	Modernizr.addTest('edge-android', (/\sEdgA\//i.test(window.navigator.userAgent)));
});
