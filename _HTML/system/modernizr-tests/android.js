/* eslint-disable spaced-comment */
/*!
{
  "name": "android",
  "property": ["android", "android2", "android3", "android4", "android5", "android6", "androidless"]
}
!*/

/**
 * Набор пользовательских тестов для `modernizr.js`.
 * @namespace modernizrTests
*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение **android**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name android
	*/
	Modernizr.addTest('android', (window.navigator.userAgent.indexOf('android') >= 0));

	/**
	 * Определение **android2**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name android2
	 */
	Modernizr.addTest('android2', (window.navigator.userAgent.indexOf('android 2.') >= 0));

	/**
	 * Определение **android3**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name android3
	 */
	Modernizr.addTest('android3', (window.navigator.userAgent.indexOf('android 3.') >= 0));

	/**
	 * Определение **android4**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name android4
	 */
	Modernizr.addTest('android4', (window.navigator.userAgent.indexOf('android 4.') >= 0));

	/**
	 * Определение **android5**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name android5
	 */
	Modernizr.addTest('android5', (window.navigator.userAgent.indexOf('android 5.') >= 0));

	/**
	 * Определение **android6**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name android6
	 */
	Modernizr.addTest('android6', (window.navigator.userAgent.indexOf('android 6.') >= 0));

	/**
	 * Определение **androidless** - андроиды 4.3 и младше
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name androidless
	 */
	Modernizr.addTest('androidless', (window.navigator.userAgent.toLowerCase().match(/\sandroid\s([0-3]|4\.[0-3])/i) !== null));
});
