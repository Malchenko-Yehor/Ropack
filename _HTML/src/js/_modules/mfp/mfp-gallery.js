'use strict';

/**
 * Инит магнифика, тип image, с галереей
 * @module
 * @see {@link http://dimsemenov.com/plugins/magnific-popup/documentation.html#image-type}
 * @see {@link http://dimsemenov.com/plugins/magnific-popup/documentation.html#gallery}
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
 * @param {JQuery.Selector} [selector="[data-mfp-src]"]- поиск элементов по селектору
 * @param {JQuery} [$context=$('.js-mfp-gallery')] - контекст в котором будет выполнен поиск селектора
 * @param {Object} [userConfig={}] - пользовательский конфиг
 * @private
 * @sourceCode
 */
function init (selector, $context, userConfig) {
	$context.each((i, el) => {
		let $element = $(el);
		let config = $.extend(true, {
			type: 'image',
			delegate: selector,
			gallery: {
				enabled: true,
				preload: [0, 2],
				navigateByImgClick: true,
				arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>'
			},
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
 * @param {JQuery.Selector} [selector="[data-mfp-src]"]- поиск элементов по селектору
 * @param {JQuery} [$context=$('.js-mfp-gallery')] - контекст в котором будет выполнен поиск селектора
 * @param {Object} [userConfig={}] - пользовательский конфиг
 * @sourceCode
 */
function mfpGallery (selector = '[data-mfp-src]', $context = $('.js-mfp-gallery'), userConfig = {}) {
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
			$element.trigger(event.type);
		});
	}

	$context.on('click', selector, load);
}

// ----------------------------------------
// Exports
// ----------------------------------------

export default mfpGallery;
