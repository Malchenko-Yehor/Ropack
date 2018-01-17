'use strict';

/**
 * Параметры плагина по умолчанию
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import 'jquery-validation';
import './extend-plugin';
import submitHandler from './submit-handler';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @const {Object}
 * @private
 * @sourceCode
 */
const configDefault = {
	submitHandler,

	ignore: ':hidden, .js-ignore',

	errorClass: 'has-error',

	validClass: 'is-valid',

	get classes () {
		return {
			error: this.errorClass,
			valid: this.validClass,
			labelError: 'label-error',
			formError: 'form--error',
			formValid: 'form--valid',
			formPending: 'form--pending'
		};
	},

	/**
	 * Валидировать элементы при потере фокуса.
	 * Или false или функция
	 * @type {Boolean|Function}
	 * @prop {HTMLElement} element
	 * @prop {Event} event
	 * @see {@link https://jqueryvalidation.org/validate/#onfocusout}
	 */
	onfocusout (element) {
		if (element.value.length || element.classList.contains(this.settings.classes.error)) {
			this.element(element);
		}
	},

	/**
	 * Валидировать элементы при keyup.
	 * Или false или функция
	 * @type {Boolean|Function}
	 * @prop {HTMLElement} element
	 * @prop {Event} event
	 * @see {@link https://jqueryvalidation.org/validate/#onkeyup}
	 */
	onkeyup (element) {
		if (element.classList.contains(this.settings.classes.error)) {
			this.element(element);
		}
	},

	/**
	 * Подсветка элементов с ошибками
	 * @param {HTMLElement} element
	 */
	highlight (element) {
		element.classList.remove(this.settings.classes.valid);
		element.classList.add(this.settings.classes.error);
	},

	/**
	 * Удаление подсветки элементов с ошибками
	 * @param {HTMLElement} element
	 */
	unhighlight (element) {
		element.classList.remove(this.settings.classes.error);
		element.classList.add(this.settings.classes.valid);
	}
};

// ----------------------------------------
// Exports
// ----------------------------------------

export default configDefault;
