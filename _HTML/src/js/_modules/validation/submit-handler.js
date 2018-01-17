'use strict';

/**
 * Обработчик сабмита формы
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

import 'custom-jquery-methods/dist/node-name';
import Preloader from '../Preloader';
import getResponse from './get-response';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Обработчик сабмита формы
 * @param {HTMLFormElement} form
 * @returns {boolean}
 * @sourceCode
 */
function submitHandler (form) {
	/**
	 * @type {JQuery}
	 */
	let $form = $(form);
	let actionUrl = $form.data('ajax');
	if (typeof (actionUrl) !== 'string') {
		window.alert([
			'Error!',
			'--------------------',
			'ajax обработчик не указан'
		].join('\n'));
		return;
	}

	let preloader = new Preloader($form);
	preloader.show();

	let formData = new window.FormData();
	formData.append('xhr-lang', $('html').attr('lang') || 'ru');

	// игнорируемые типы инпутов
	let ignoredInputsType = [
		'submit',
		'reset',
		'button',
		'image'
	];

	$form.find('input, textarea, select').each((i, element) => {
		let {value, type} = element;
		if (~ignoredInputsType.indexOf(type)) {
			return true;
		}

		let $element = $(element);
		let elementNode = $element.nodeName();
		let elementName = $element.data('name') || null;

		if (elementName === null) {
			return true;
		}

		switch (elementNode) {
			case 'input':
				if (type === 'file' && element.files && element.files.length) {
					for (let i = 0; i < element.files.length; i++) {
						let file = element.files[i];
						formData.append(elementName, file);
					}
				} else {
					if ((type === 'checkbox' || type === 'radio') && !element.checked) {
						break;
					}
					formData.append(elementName, value);
				}
				break;

			case 'textarea':
				formData.append(elementName, value);
				break;

			case 'select':
				let multiName = /\[\]$/;
				if ((multiName.test(elementName) || element.multiple) && element.selectedOptions && element.selectedOptions.length) {
					elementName = elementName.replace(multiName, '');
					for (let i = 0; i < element.selectedOptions.length; i++) {
						let option = element.selectedOptions[i];
						if (option.disabled) {
							continue;
						}
						formData.append(elementName, option.value);
					}
				} else {
					formData.append(elementName, value);
				}
				break;
		}
	});

	let xhr = new window.XMLHttpRequest();
	xhr.open('POST', actionUrl);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			let {status, statusText, response} = xhr;
			// все плохо
			if (status !== 200) {
				console.log(xhr);
				window.alert([
					'Error!',
					'status: ' + status,
					'--------------------',
					statusText
				].join('\n'));
				return false;
			}

			if (typeof response === 'string') {
				response = JSON.parse(response);
			}
			getResponse($form, response, statusText, xhr);
		}
	};

	xhr.send(formData);
	return false;
}

// ----------------------------------------
// Exports
// ----------------------------------------

export default submitHandler;
