'use strict';

/**
 * Данные для `wezom-starter`
 * Это системный модуль, который используется для составления настроек
 * во время установки проекта при помоши "ws" клиента
 * @module
 * @author Dutchenko Oleg <dutchenko.o.dev@gmail.com>
 * @version 9.0.0
 */

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Составление данных
 * @sourceCode
 * @param {Object} globals - Глобальные данные
 * @param {Object} globals.lodash
 * @param {string} globals.dirname - Имя текущей директории
 * @param {Function} globals.logger - логгер
 * @returns {Object}
 */
function createData (globals) {
	/**
	 * Данные для составления опроса
	 * @const {Object}
	 */
	const data = {
		/**
		 * [Getter] Данные по умолчанию
		 * @return {Object}
		 */
		get defaults () {
			return {
				WezomCMS: true,
				bs: {
					enable: true,
					static: false,
					host: true
				}
			};
		},

		/**
		 * Список компонентов по умоплчанию
		 */
		defaultComponents: {},

		/**
		 * Список файлов проекта
		 * @type {Array.<string>}
		 */
		files: {
			// Рабочая директория шаблона сборки
			cwd: './',

			// список файлов, в которых нужно сделать замену значений
			setData: [
				'./gulpfile.js',
				'./config.html.js'
			],

			// Путь к директории компонентов шаблона сборки
			'components-folder': './_HTML/frontend-components/',

			// строковые регулярки для фильтровки подходящих компонентов
			// для текущего шаблона сборки
			'components-name-filter': [
				'template-default$'
			],

			// из значений будут созданны регулярные выражения,
			// поэтому - следует экранировать специфические символы, с учетом регистра!
			// пример итоговой регулярки => /\.git(\\|\/|$)|\.idea(\\|\/|$)|wezom-starter\.js$/
			filter: [
				'\\.git(\\\\|\\/|$)',
				'\\.idea(\\\\|\\/|$)',
				'wezom-starter\\.js$'
			]
		},

		/**
		 * [Getter] Составление вопросов
		 * @return {Array.<Object>}
		 */
		get questions () {
			let logger = globals.logger;
			let defaults = this.defaults;

			let list = [{
				type: 'confirm',
				name: 'WezomCMS',
				message: 'Сборка для WezomCMS 4.x+',
				default: defaults.WezomCMS,
				when () {
					logger('gray', '=> markup');
					return true;
				}
			}, {
				type: 'confirm',
				name: 'bs.enable',
				message: 'Использовать browser-sync (рекомендуется)',
				default: defaults.bs.enable,
				when () {
					logger('gray', '=> browser-sync');
					return true;
				}
			}, {
				type: 'confirm',
				name: 'bs.static',
				message: [
					'Статический сервер browser-sync',
					'используйте, только если у Вас нету локального серверa'
				],
				default: defaults.bs.static,
				when: (answers) => answers.bs.enable
			}, {
				type: 'confirm',
				name: 'bs.host',
				message: [
					'Использовать именованный хост,',
					'Если нет - в качестве хоста используется ip'
				],
				default: defaults.bs.host,
				when: (answers) => answers.bs.enable && !answers.bs.static
			}];

			list.forEach(q => {
				if (Array.isArray(q.message)) {
					q.message = q.message.join('\n  ');
				}
			});

			return list;
		}
	};

	return data;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createData;
