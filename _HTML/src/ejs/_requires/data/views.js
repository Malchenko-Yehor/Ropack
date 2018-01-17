'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Обертка
 * @param {Object} app
 * @returns {Function}
 * @private
 */
function wrapper (app) {
	const {View} = app.data;

	/**
	 * Флаг быстрого отклбчения критикал стилей для всех страниц
	 * @const {boolean}
	 * @private
	 */
	const disableCriticalCSSByViews = false;

	/**
	 * Справочник по основным страницам `ejs` ренедера
	 * @type {Object}
	 * @memberOf app.data
	 * @sourceCode
	 */
	let views = {
		'index': new View('index', {
			title: 'Главная страница',
			criticalCSS: [
				// 'assets/css/critical/generated/index.css'
			]
		}),

		'404': new View('404', {
			title: '404 Страница не найдена',
			criticalCSS: [
				// 'assets/css/critical/generated/404.css'
			]
		}),

		'sitemap': new View('sitemap', {
			title: 'Карта сайта',
			criticalCSS: [
				// 'assets/css/critical/generated/sitemap.css'
			]
		}),

		'ui': new View('ui', {
			title: 'UI Kit'
		}),

		'ui-svg': new View('ui-svg', {
			title: 'UI SVG Icons'
		}),

		'ui-wysiwyg': new View('ui-wysiwyg', {
			title: 'UI Типография'
		}),

		'ui-forms': new View('ui-forms', {
			title: 'UI Формы'
		})
	};

	if (disableCriticalCSSByViews) {
		for (let key in views) {
			views[key].criticalCSS = [];
		}
	}

	return views;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
