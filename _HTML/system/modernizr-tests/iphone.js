/* eslint-disable spaced-comment */
/*!
{
  "name": "iphone",
  "property": ["iphone", "iphone4", "iphone5", "iphone6", "iphone6plus"]
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	var iPhone = !!~navigator.userAgent.toLowerCase().indexOf('iphone');
	var iPhoneWidth = window.screen.width;
	var iPhoneHeight = window.screen.height;

	if (iPhoneWidth > iPhoneHeight) {
		var tmp = iPhoneHeight;
		iPhoneHeight = iPhoneWidth;
		iPhoneWidth = tmp;
	}

	/**
	 * Определение **iphone**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name iphone
	 */
	Modernizr.addTest('iphone', iPhone);

	/**
	 * Определение **iphone4**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name iphone4
	 */
	Modernizr.addTest('iphone4', (iPhone && (iPhoneWidth === 320 && iPhoneHeight === 480)));

	/**
	 * Определение **iphone5**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name iphone5
	 */
	Modernizr.addTest('iphone5', (iPhone && (iPhoneWidth === 320 && iPhoneHeight === 568)));

	/**
	 * Определение **iphone6**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name iphone6
	 */
	Modernizr.addTest('iphone6', (iPhone && (iPhoneWidth === 375 && iPhoneHeight === 667)));

	/**
	 * Определение **iphone6plus**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name iphone6plus
	 */
	Modernizr.addTest('iphone6plus', (iPhone && (iPhoneWidth === 414 && iPhoneHeight === 736)));
});
