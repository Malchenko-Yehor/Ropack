'use strict';

/**
 * Инит валидации форм
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import 'custom-jquery-methods/fn/has-inited-key';
import Preloader from '../Preloader';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {JQuery.Selector|JQuery} [selector=".js-form"]- поиск элементов по селектору
 * @param {JQuery} [$context=null] - контекст в котором будет выполнен поиск селектора
 * @sourceCode
 */
function validate (selector = '.js-form', $context = null) {
	/**
	 * @type {JQuery}
	 */
	let $forms = (selector && selector.jquery) ? selector : $(selector, $context);
	$forms.each((i, el) => {
		let $form = $(el);
		if ($form.hasInitedKey('validator', false)) {
			return true;
		}

		let preloader = new Preloader($form);
		preloader.show();

		import(
			/* webpackChunkName: "validate" */
			'./config-default.js'
		).then(config => {
			let {default: configDefault} = config;
			let {default: setHandlers} = require('./set-handlers');
			let configUser = $form.data('validation-config') || {};
			let configCurrent = $.extend(true, {}, configDefault, configUser);

			$form.validate(configCurrent);
			setHandlers($form, $form.data('validator'));
			preloader.hide();
		});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

export default validate;
