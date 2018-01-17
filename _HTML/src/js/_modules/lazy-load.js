'use strict';

/**
 * Инит плгина lozad.js
 * @module
 * @see {@link https://github.com/ApoorvSaxena/lozad.js}
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import 'custom-jquery-methods/fn/node-name';

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Коллбек вставки источника
 * @param {JQuery} $el
 * @private
 * @sourceCode
 */
function onLoad ($el) {
	let $parent = $el.parent('.lozad-parent');
	let delay = $el.data('lozad-delay') || 50;
	setTimeout(() => {
		if ($parent.length) {
			$parent.addClass('lozad-parent--is-ready');
		}
		$el.addClass('lozad--is-ready');
	}, delay);
}

/**
 * Добавлеям `lazyLoad` к глобальныму объекту `window`
 * @private
 * @sourceCode
 */
function createLazyLoad () {
	const lozad = require('lozad');
	window.lazyLoad = lozad('.lozad', {
		load (el) {
			let $el = $(el);
			let nodeName = $el.nodeName();
			let img = document.createElement('img');

			if (nodeName === 'picture') {
				let $img = $(img);
				$img.on('load', () => onLoad($el));
				$el.append($img);
			} else {
				let src = $el.data('lozad');
				img.onload = () => {
					if ($el.nodeName() === 'img') {
						$el.attr('src', src);
					} else {
						$el.css('background-image', `url(${src})`);
					}
					onLoad($el);
				};
				img.src = src;
			}
		}
	});

	window.lazyLoad.observe();
}

// ----------------------------------------
// Public
// ----------------------------------------

(function ($) {
	if (!$('.lozad').length) {
		return false;
	}

	// если уже `lazyLoad` добавлен вызываем
	if (window.lazyLoad) {
		return window.lazyLoad.observe();
	}

	// иначе добавляем
	if (window.Modernizr.intersectionobserver) {
		createLazyLoad();
	} else {
		// грузим асинхронно полифилл если не поддерживается Intersection Observer
		import(
			/* webpackChunkName: "intersection-observer" */
			'intersection-observer'
		).then(createLazyLoad);
	}
})(window.jQuery);
