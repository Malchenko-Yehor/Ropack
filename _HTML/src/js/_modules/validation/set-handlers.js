'use strict';

/**
 * Пользовательские обработчики формы
 * @module
 */

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {JQuery} $form
 * @param {Object} Validator {@link https://jqueryvalidation.org/?s=validator}
 * @param {Function} Validator.resetForm {@link https://jqueryvalidation.org/Validator.resetForm/}
 */
function setHandlers ($form, Validator) {
	// сброс формы
	$form.on('reset', () => Validator.resetForm());

	// дальше ваш код
}

// ----------------------------------------
// Exports
// ----------------------------------------

export default setHandlers;
