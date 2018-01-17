'use strict';

/**
 * @fileOverview Основной файл инициализации модулей
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import './_vendors/promise-polyfill';
import './_vendors/jquery';

import './_modules/lazy-load';
import horizontalScroll from './_modules/horizontal-scroll';
import wrapMedia from './_modules/wrap-media';
import validate from './_modules/validation/validate';
import mfpAjax from './_modules/mfp/mfp-ajax';
import mfpInline from './_modules/mfp/mfp-inline';
import mfpIframe from './_modules/mfp/mfp-iframe';
import mfpGallery from './_modules/mfp/mfp-gallery';
import prism from './_modules/prismjs/prism';
import wsTabs from './_modules/wstabs';

// ----------------------------------------
// Public
// ----------------------------------------

window.jQuery(document).ready($ => {
	prism();
	horizontalScroll('.wysiwyg table');
	wrapMedia('.wysiwyg iframe, .wysiwyg video');
	validate('.js-form');
	mfpAjax();
	mfpInline();
	mfpIframe();
	mfpGallery();
	wsTabs.init();
	wsTabs.setActive(); // если нужно принудительно активировать табы
});

if (IS_PRODUCTION) {
	require('./_modules/wezom-log');
}
