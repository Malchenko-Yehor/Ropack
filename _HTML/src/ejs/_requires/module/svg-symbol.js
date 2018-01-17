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
	// выгружаем инструменты
	const {usePHP} = app.data;
	const {notify, media} = app.module;

	/**
	 * Компонент установки пути к svg спрайту с указанием символа.
	 * @param {string} symbol - символ из спрайта
	 * @return {string} составленный путь к файлу
	 *
	 * @memberOf app.module
	 * @requires app.data.usePHP
	 * @requires app.module.notify
	 * @requires app.module.media
	 * @sourceCode
	 */
	function svgSymbol (symbol) {
		if (typeof symbol !== 'string') {
			notify.onWarn('app.module.svgSymbol', 'Вы указали не корректный символ');
			return '';
		}

		if (usePHP) {
			return `<?php echo HTML::svgSymbol( '${symbol}' ); ?>`;
		}
		return media('assets/images/sprites/icons.svg') + '#' + symbol;
	}

	return svgSymbol;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
