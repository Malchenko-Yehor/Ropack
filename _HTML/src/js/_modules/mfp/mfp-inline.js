'use strict';

/**
 * Инит магнифика, тип inline
 * @module
 * @see {@link http://dimsemenov.com/plugins/magnific-popup/documentation.html#inline-type}
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import Preloader from '../Preloader';

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Инит метода
 * @param {JQuery.Selector|JQuery} [selector=".js-mfp-inline"]- поиск элементов по селектору
 * @param {JQuery} [$context=$('body')] - контекст в котором будет выполнен поиск селектора
 * @param {Object} [userConfig={}] - пользовательский конфиг
 * @private
 * @sourceCode
 */
function init (selector, $context, userConfig) {
	/**
	 * @type {JQuery}
	 */
	let $elements = (selector && selector.jquery) ? selector : $(selector, $context);
	$elements.each((i, el) => {
		let $element = $(el);
		let config = $.extend(true, {
			type: 'inline',
			closeBtnInside: true,
			removalDelay: 300,
			mainClass: 'mfp-animate-zoom-in'
		}, userConfig);

		$element.magnificPopup(config);
	});
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Загрузка по требованию
 * @param {JQuery.Selector} [selector=".js-mfp-inline"]- поиск элементов по селектору
 * @param {JQuery} [$context=$('body')] - контекст в котором будет выполнен поиск селектора
 * @param {Object} [userConfig={}] - пользовательский конфиг
 * @sourceCode
 */
function mfpInline (selector = '.js-mfp-inline', $context = $('body'), userConfig = {}) {
	/**
	 * @param {JQuery.Event} event
	 */
	function load (event) {
		event.preventDefault();
		$context.off('click', selector, load);

		let $element = $(this);
		let preloader = new Preloader($element);
		preloader.show();

		import(
			/* webpackChunkName: "magnific-popup" */
			'./mfp'
		).then(() => {
			init(selector, $context, userConfig);
			preloader.hide();
			$element.magnificPopup('open');
		});
	}

	$context.on('click', selector, load);
}

// ----------------------------------------
// Exports
// ----------------------------------------

export default mfpInline;
