'use strict';

/**
 * Инит магнифика, тип ajax
 * @module
 * @see {@link http://dimsemenov.com/plugins/magnific-popup/documentation.html#ajax-type}
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import validate from '../validation/validate';
import horizontalScroll from '../horizontal-scroll';
import wrapMedia from '../wrap-media';
import Preloader from '../Preloader';

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Инит метода
 * @param {string} [selector=".js-mfp-ajax"]- поиск элементов по селектору
 * @param {JQuery} [$context=$('body')] - контекст в котором будет выполнен поиск селектора
 * @param {Object} [userConfig={}] - пользовательский конфиг
 * @private
 * @sourceCode
 */
function init (selector, $context, userConfig) {
	const config = $.extend(true, {
		mainClass: 'mfp-animate-zoom-in',
		type: 'ajax',
		delegate: selector,
		removalDelay: 300,
		callbacks: {
			elementParse (item) {
				let {
					url,
					type = 'POST',
					param: data = {}
				} = item.el.data();
				this.st.ajax.settings = {url, type, data};
			},
			ajaxContentAdded () {
				let $container = this.contentContainer || [];
				if ($container) {
					horizontalScroll('.wysiwyg table', $container);
					wrapMedia('.wysiwyg iframe, .wysiwyg video', $container);
					validate('.js-form', $container);
				}
			}
		}
	}, userConfig);

	$context.magnificPopup(config);
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Загрузка по требованию
 * @param {string} [selector=".js-mfp-ajax"]- поиск элементов по селектору
 * @param {JQuery} [$context=$('body')] - контекст в котором будет выполнен поиск селектора
 * @param {Object} [userConfig={}] - пользовательский конфиг
 * @sourceCode
 */
function mfpAjax (selector = '.js-mfp-ajax', $context = $('body'), userConfig = {}) {
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

export default mfpAjax;
