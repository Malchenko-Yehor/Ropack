'use strict';

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Обертка
 * @param app
 * @returns {app.el.SvgIcon}
 * @private
 */
function wrapper (app) {
	const {El, ElSVG} = app.el;
	const {svgSymbol, notify} = app.module;
	const {list} = app.data.svg;

	/**
	 * @classDesc Обертка создания стандартной SVG иконки
	 *
	 * #### Создание иконки по символу
	 *
	 * _Если симовла нету в [сгенирированном списке]{@link app.data.svg}_
	 * _Вы получите уведомление в терминале_
	 *
	 * ```ejs
	 * <%- new app.el.SvgIcon('icon-wezom') %>
	 * ```
	 *
	 * Результат (usePHP)
	 *
	 * ```php
	 * <svg class="svg-icon" viewBox="0 0 57 21" width="57" height="21">
	 *     <use xlink:href="<?php echo HTML::svgSymbol( 'icon-wezom' ); ?>"></use>
	 * </svg>
	 * ```
	 *
	 * Результат (usePHP откл.)
	 *
	 * ```php
	 * <svg class="svg-icon" viewBox="0 0 57 21" width="57" height="21">
	 *     <use xlink:href="/Media/assets/images/sprites/icons.svg?v=1511199198#icon-wezom"></use>
	 * </svg>
	 * ```
	 *
	 * #### Пример с дополнительными параметрами
	 *
	 * Вы можете определиьт пресет с частых параметров, к примеру
	 *
	 * ```js
	 * static get preset () {
	 *    return {
	 *        'my-preset': {
	 *           class: [
	 *              'my-svg-icon-class'
	 *              'my-svg-icon-class--mods'
	 *           ]
	 *        }
	 *    };
	 * }
	 * ```
	 *
	 * Пресеты всегда объеденяются с дефолтными параметрами
	 *
	 * ```ejs
	 * <%- new app.el.SvgIcon('icon-wezom', 'my-preset') %>
	 * ```
	 *
	 * Результат
	 *
	 * ```php
	 * <svg class="svg-icon my-svg-icon-class my-svg-icon-class--mods" viewBox="0 0 57 21" width="57" height="21">
	 *     <use xlink:href="<?php echo HTML::svgSymbol( 'icon-wezom' ); ?>"></use>
	 * </svg>
	 * ```
	 *
	 * @memberOf app.el
	 * @param {string} symbol - имя символа
	 * @param {string} [preset] - пресет свойств
	 * @param {Object} [props={}] - свойства элемента
	 * @param {Function} [done] - коллбек создания
	 * @returns {Element}
	 * @requires app.el.El
	 * @requires app.el.ElSVG
	 * @requires app.module.svgSymbol
	 * @requires app.module.notify
	 */
	class SvgIcon {
		constructor (symbol, preset, props = {}, done) {
			let data = list[symbol];
			if (data === undefined) {
				let message = ` Symbol "${symbol}" - does not exist in the SVG icons list`;
				notify.onWarn('SvgIcon', message);
				return new El('div', {}, ($el) => {
					$el.textContent = message;
				});
			}

			let currentProps = El.mergeProps(
				SvgIcon.defaults,
				{
					viewBox: data.viewBox,
					width: data.width,
					height: data.height
				},
				SvgIcon.preset[preset],
				props
			);

			let $svg = new ElSVG('svg', currentProps, $el => {
				let $use = new ElSVG('use', {
					'xlink:href': svgSymbol(symbol)
				});
				El.setAttr($el, currentProps, 'viewBox');
				El.setAttr($el, currentProps, 'width');
				El.setAttr($el, currentProps, 'height');
				$el.appendChild($use);
			});

			if (done) {
				done($svg);
			}
			return $svg;
		}

		/**
		 * Дефольный набор свойств
		 * @returns {Object}
		 * @sourceCode
		 */
		static get defaults () {
			return {
				class: 'svg-icon'
			};
		}

		/**
		 * Список пресетов
		 * @returns {Object}
		 * @sourceCode
		 */
		static get preset () {
			return {};
		}
	};

	return SvgIcon;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = wrapper;
