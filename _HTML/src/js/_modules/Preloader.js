'use strict';

/**
 * Простой прелоадер
 * @module
 */

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Дофелтный конфиг для всех экземпляров прелоадера
 * @type {Object}
 * @prop {string} mainClass - основной CSS класс, который добавляется к контейнеру прелодара
 * @prop {string} subClass - Дополнительный CSS класс - который будет добавлен, если имеет логически позитивное значение
 * @prop {string} showClass - CSS класс, который добавляется к контейнеру прелодара, при его показе
 * @prop {string} hideClass - CSS класс, который добавляется к контейнеру прелодара, перед его закрытием
 * @prop {number} removeDelay - время задержки, после которой будут удалены разметка прелоадре и CSS классы у контейнера
 * @prop {string} markup - Разметка прелодера
 * @private
 */
let defaultConfig = {
	mainClass: 'preloader',
	subClass: '',
	showClass: 'preloader--show',
	hideClass: 'preloader--hide',
	removeDelay: 200,
	markup: '<div class="preloader__block"></div>'
};

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Создание прелодаров
 * @param {JQuery} $container - контейнер для прелоадера
 * @param {Object} [userConfig={}] - Пользвательский конфиг для создваемого экземпляра
 * @prop {JQuery} [$container] - контейнер для прелоадера
 * @prop {Object} [config] - прелоадера
 * @prop {Object|number} timer - id таймера
 * @prop {boolean} empty
 * @example
 * let preloader = new Preloader($myElement);
 * preloader.show();
 * window.setTimeout(() => preloader.hide(), 1000);
 */
class Preloader {
	constructor ($container, userConfig = {}) {
		if (!($container && $container.length)) {
			this.empty = true;
			return this;
		}
		if ($container.data('preloader') instanceof Preloader) {
			return $container.data('preloader');
		}
		this.empty = false;
		this.$container = $container;
		this.config = $.extend(true, {}, Preloader.config, userConfig);
		this.timer = null;
		this.$container.data('preloader', this);
	}

	/**
	 * Показ прелодера
	 * @param {string} [place="append"] - append / prepend / before / after
	 * @sourceCode
	 */
	show (place = 'append') {
		if (this.empty) {
			console.warn('Empty preloader cannot be shown!');
			return false;
		}
		let {mainClass, subClass, showClass, markup} = this.config;

		this.$container.each((i, el) => {
			let $container = $(el);
			$container.addClass(mainClass);
			if (subClass) {
				$container.addClass(subClass);
			}
			$container.data('$preloaderMarkup', $(markup));
			$container[place]($container.data('$preloaderMarkup'));
			window.setTimeout(() => $container.addClass(showClass), 10);
		});
	}

	/**
	 * Скрытие прелодера
	 * @param {boolean} [removeMarkup=true] - удалить разметку прелодера после скрытия
	 * @sourceCode
	 */
	hide (removeMarkup = true) {
		if (this.empty) {
			console.warn('Empty preloader cannot be hidden!');
			return false;
		}
		let {mainClass, subClass, showClass, hideClass} = this.config;
		this.$container.addClass(hideClass);
		window.clearTimeout(this.timer);
		this.timer = window.setTimeout(() => {
			if (removeMarkup) {
				this.$container.each((i, el) => {
					$(el).data('$preloaderMarkup').remove();
				});
			}
			this.$container.removeClass([mainClass, showClass, hideClass].join(' '));
			if (subClass) {
				this.$container.removeClass(subClass);
			}
		}, this.config.removeDelay + 50);
	}

	/**
	 * Получение глобального конфига для всех прелодаров
	 * @returns {Object}
	 * @sourceCode
	 */
	static get config () {
		return defaultConfig;
	}

	/**
	 * Установка глобального конфига
	 * @param {Object} value
	 * @sourceCode
	 * @example
	 * Preloader.config = {mainClass: 'my-preloader'}
	 */
	static set config (value) {
		$.extend(true, defaultConfig, value);
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

export default Preloader;
