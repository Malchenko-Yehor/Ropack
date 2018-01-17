'use strict';

/**
 * @fileOverview Конфиг для генерации критикал стилей
 * @module critical-config
 * @author Dutchenko Oleg <dutchenko.o.dev@gmail.com>
 * @version 9.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const {paths} = require('./config.html');

// ----------------------------------------
// Public
// ----------------------------------------

function createConfig (bs) {
	// корневой урл
	const host = 'http://' + bs.getOption('host') + ':' + bs.getOption('port');

	// параметры по умолчанию
	const defaults = {
		destPath: './_HTML/src/sass/critical/generated', // директория куда будет сохранен итоговый файл
		// destName: index // здесь вы можете указатькостомное имя файла, по умолчанию имя свойства -> viewsConfig[key]
		destExt: '.scss', // расширение итогово файла стилей
		disabled: false, // если true - пропускаем страницу в списке генерации
		url: null, // к странице
		css: [ // Пути к CSS файлам с которых будем генерировать критикал, все пути от gulpfile.js
			`${paths.assets}css/vendors.css`,
			`${paths.assets}css/style.css`,
			`${paths.assets}css/editor.css`,
			`${paths.assets}css/helpers.css`
		],
		forceInclude: [ // selectors to keep
			'.wrapper', // example
			/^\.section/ // example
		],
		ignoreCode: [ // Пользовательские ругелярки для игнорирования блоков CSS кода
			/@print\s+{((?!}).|\n|\r)+}/gi, // @print директива
			/@font-face\s+{((?!}).|\n|\r)+}/gi, // @font-face директива
			/#mm-blocker((?!\}).|\n)*\}/g,
			/\.(footer|wezom-link|mm-)((?!\}).|\n)*\}/gi,
			/url\(((?!\)).)+\)/gi, // url функция
			/(\w|-)+:\s*;/gi // пустые правила, которые могут получится после вырезки предыдущих игноров
		],
		propertiesToRemove: [
			'(.*)transition(.*)',
			'cursor',
			'pointer-events',
			'background-image',
			'(-webkit-)?tap-highlight-color',
			'(.*)user-select'
		],
		keepLargerMediaQueries: false, // when true, will not filter out larger media queries
		width: 1920, // viewport width
		height: 900, // viewport height
		timeout: 30000, // ms; abort critical CSS generation after this timeout
		pageLoadSkipTimeout: 0, // ms; stop waiting for page load after this timeout (for sites with broken page load event timings)
		strict: false, // set to true to throw on CSS errors (will run faster if no errors)
		maxEmbeddedBase64Length: 1000, // characters; strip out inline base64 encoded resources larger than this
		userAgent: 'Penthouse Critical Path CSS Generator', // specify which user agent string when loading the page
		renderWaitTime: 100, // ms; render wait timeout before CSS processing starts (default: 100)
		blockJSRequests: false, // set to false to load (external) JS (default: true)
		customPageHeaders: {
			'Accept-Encoding': 'identity' // add if getting compression errors like 'Data corrupted'
		}
	};

	// составление конфига для каждой въюхи
	// объекдиняет дефолтный конфиг с пользовательским
	function setConfig (data = {}) {
		return Object.assign({}, defaults, data);
	}

	// Конфиги для каждой страницы
	// На основе этого списка выполняется проход для генерации
	const viewsConfig = {
		'404': setConfig({
			url: host + '/_HTML/dist/404.html'
		}),
		index: setConfig({
			url: host + '/_HTML/dist/index.html'
		}),
		sitemap: setConfig({
			url: host + '/_HTML/dist/sitemap.html'
		}),
		ui: setConfig({
			url: host + '/_HTML/dist/ui.html',
			disabled: true // пример отключения страницы из списка генерации
		})
	};

	return viewsConfig;
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createConfig;
