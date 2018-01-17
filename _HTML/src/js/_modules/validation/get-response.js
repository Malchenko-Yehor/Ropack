'use strict';

/**
 * Обработка ответа от сервера
 * @module
 */

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {JQuery} $form
 * @param {Object} response
 * @param {string} textStatus
 * @param {Object} jqXHR
 * @param {string} [response.redirect] - урл для редиректа, если равен текущему урлу - перегражаем страницу
 * @param {boolean} [response.reload] - перегрузить страницу
 * @param {boolean} [response.reset] - сбросить форму
 * @param {Array} [response.clear] - сбросить форму
 * @private
 */
function getResponse ($form, response, textStatus, jqXHR) {
	let {preloader} = $form.data();

	// обрабатываем ответ
	// ------------------
	if (typeof response === 'string') {
		response = JSON.parse(response);
	}

	if (response.reload || window.location.href === response.redirect) {
		return window.location.reload();
	}

	if (response.redirect) {
		return (window.location.href = response.redirect);
	}

	if (response.success) {
		if (response.clear) {
			if (Array.isArray(response.clear)) {
				response.clear.forEach(clearSelector => {
					$form.find(clearSelector).val('');
				});
			} else {
				// игнорируемые типы инпутов
				let ignoredInputsType = [
					'submit',
					'reset',
					'button',
					'image'
				];
				$form.find('input, textarea, select').each((i, element) => {
					if (~ignoredInputsType.indexOf(element.type)) {
						return true;
					}
					element.value = '';
				});
			}
		} else if (response.reset) {
			$form.trigger('reset');
		}

		preloader.hide();
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

export default getResponse;
