/* eslint-disable spaced-comment */
/*!
{
  "name": "meizu",
  "property": ["meizu", "meizu-note"]
}
!*/

define(['Modernizr'], function (Modernizr) { // eslint-disable-line no-undef
	/**
	 * Определение **Meizu**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name meizu
	*/
	Modernizr.addTest('meizu', (/Android\s.*MZ(-)?/i.test(window.navigator.userAgent)));

	/**
	 * Определение **Meizu Note**
	 * @type {boolean}
	 * @memberOf modernizrTests
	 * @name redmi
	*/
	Modernizr.addTest('meizu-note', (/Android\s.*MZ(-)?.*\snote\s/i.test(window.navigator.userAgent)));
});
