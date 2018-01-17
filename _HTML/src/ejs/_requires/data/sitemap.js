'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Обертка
 * @param {Object} app
 * @returns {Array}
 * @private
 */
function wrapper (app) {
	const {views} = app.data;

	/**
	 * Составление карты сайта
	 * @type {Array.<Object>}
	 * @memberOf app.data
	 * @sourceCode
	 */
	let sitemap = [{
		href: views['index'].href,
		title: views['index'].title,
		children: [{
			href: views['ui'].href,
			title: views['ui'].title,
			children: [{
				href: views['ui-wysiwyg'].href,
				title: views['ui-wysiwyg'].title
			}, {
				href: views['ui-svg'].href,
				title: views['ui-svg'].title
			}, {
				href: views['ui-forms'].href,
				title: views['ui-forms'].title
			}]
		}, {
			href: views['sitemap'].href,
			title: views['sitemap'].title
		}]
	}];

	return sitemap;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
