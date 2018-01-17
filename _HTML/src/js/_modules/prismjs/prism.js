'use strict';

/**
 * Подключение плагина `prismjs`
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import Preloader from '../Preloader';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {JQuery.Selector} [selector="code[class*='lang']"]- поиск элементов по селектору
 * @param {JQuery} [$context=null] - контекст в котором будет выполнен поиск селектора
 * @sourceCode
 */
function prism (selector = 'code[class*="lang"]', $context = null) {
	let $code = (selector && selector.jquery) ? selector : $(selector, $context);
	if ($code.length) {
		let preloader = new Preloader($code.parent('pre'));
		preloader.show();
		import(
			/* webpackChunkName: "prismjs" */
			'./prismjs-import'
		).then(() => {
			preloader.hide();
		});
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

export default prism;
