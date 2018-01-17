'use strict';

/**
 * Расширение дефолтных параметров плагина
 * @module
 */

// ----------------------------------------
// Public
// ----------------------------------------

(function ($, jsTranslations = {}) {
	let mfp = jsTranslations.mfp || {};
	if (Object.keys(mfp).length === 0) {
		return console.warn('Переводы для magnificPopup - отсутствуют!');
	}

	$.extend(true, $.magnificPopup.defaults, {
		tClose: mfp.tClose,
		tLoading: mfp.tLoading,
		gallery: {
			tPrev: mfp.tPrev,
			tNext: mfp.tNext,
			tCounter: mfp.tCounter
		},
		image: {
			tError: mfp.tErrorImage
		},
		ajax: {
			tError: mfp.tError
		},
		inline: {
			tNotFound: mfp.tNotFound
		}
	});
})(window.jQuery, window.jsTranslations);
