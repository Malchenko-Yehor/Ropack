'use strict';

/**
 * @fileOverview Основной файл запуска менеджера задач `gulp`
 * @author Dutchenko Oleg <dutchenko.o.dev@gmail.com>
 * @version 9.0.8
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const path = require('path');
const watchAndTouch = require('gulp-watch-and-touch');

const pkg = require('./package.json');
const logger = require('./_HTML/system/utils/logger');
const notify = require('./_HTML/system/utils/notify');
const {task, argv, paths, ftpPresets, watchers, WezomCMS} = require('./config.html');

var browserSync = null;
try {
	browserSync = require('browser-sync').create();
} catch (err) {
	browserSync = {
		reload: () => logger('gray', 'browserSync pseudo reload'),
		init: () => logger('gray', 'browserSync pseudo init'),
		stream: () => logger('gray', 'browserSync pseudo stream'),
		getOption: () => logger('gray', 'browserSync pseudo getOption'),
		exit: () => logger('gray', 'browserSync pseudo exit')
	};
}

// ----------------------------------------
// Private
// ----------------------------------------

// Уведомление о старте работ
logger('yellow', '', 'Starting gulp...');

const {
	// список задач для запуска с дефолтной задачей
	run: runningTasks,
	// список задач для фонового запуска с дефолтной задачей
	bg: bgTasks
} = argv;

/**
 * Проверка задачи и создание
 * @private
 * @param {string} task - имя задачи
 * @returns {boolean|undefined} - флаг проверки
 */
function hasTask (task) {
	if (task === undefined) {
		return false;
	}
	let has = typeof gulpTasks[task] === 'function';
	if (has) {
		logger('gray', `Create a task "${task}"`);
		gulpTasks[task]();
	} else {
		logger('red', `Task "${task}" - is not defined, skipping creation!`);
	}
	return has;
}

/**
 * Проверка массива задач
 * @private
 * @param {Array|null} list - список задач
 * @returns {Array} - если задач нету - пустой массив
 */
function mapTasks (list) {
	if (Array.isArray(list)) {
		return list.filter(task => {
			if (hasTask(task)) {
				return task;
			}
		});
	}
	return [];
}

/**
 * Определение локальной директории
 * @private
 * @returns {string}
 */
function localFolder () {
	let folder = '';
	let getFolder = (arr = path.normalize(process.cwd()).replace(/(\\)+/g, '/').split('/')) => {
		folder = arr.pop();
		if (~pkg.projectFolders['ignore-detect'].indexOf(folder)) {
			getFolder(arr);
		}
	};
	getFolder();
	return folder;
}

// ----------------------------------------
// Public
// ----------------------------------------

// Список задач
const gulpTasks = {
	/**
	 * Генерация критикал стилей
	 * @name gulp critical
	 * @global
	 */
	'critical' () {
		const createConfig = require('./config.critical');
		const gulpTask = require('./_HTML/system/tasks/critical');
		return gulpTask('critical', createConfig, browserSync);
	},

	/**
	 * Составление списка `todo` на основе комментариев разметки
	 * @name gulp todo
	 * @global
	 */
	'todo' () {
		const gulpTask = require('./_HTML/system/tasks/todo');
		const taskPaths = {
			src: [
				'./_HTML/system/todo-banner.md',
				path.join(paths.markup, '*.{php,html}'),
				'!' + path.join(paths.markup, 'ui*')
			],
			dest: './'
		};
		return gulpTask('todo', taskPaths);
	},

	/**
	 * Очистка всех директорий сборки
	 * @name gulp clear
	 * @global
	 */
	'clear' () {
		const taskName = 'clear';
		const gulpTask = require('./_HTML/system/tasks/clear');
		const askBeforeDelete = !~argv.define.indexOf('no-ask-before-delete');
		const taskPaths = {
			src: paths.clearFolders
		};
		return gulpTask(taskName, taskPaths, askBeforeDelete);
	},

	/**
	 * Очистка всех MEDIA директорий сборки
	 * @name gulp clear-media
	 * @global
	 */
	'clear-media' () {
		const taskName = 'clear-media';
		const gulpTask = require('./_HTML/system/tasks/clear');
		const askBeforeDelete = !~argv.define.indexOf('no-ask-before-delete');
		const taskPaths = {
			src: paths.assets
		};
		return gulpTask(taskName, taskPaths, askBeforeDelete);
	},

	/**
	 * Составление `svg` спрайта
	 * @name gulp svg-sprite
	 * @global
	 */
	'svg-sprite' () {
		const taskName = 'svg-sprite';
		const gulpTask = require('./_HTML/system/tasks/svg-sprite');
		const SvgList = require('./_HTML/system/utils/svg-list');
		const svgList = new SvgList();

		const taskPaths = {
			src: [
				'./_HTML/src/svg-sprite/from-parser-only/*.svg',
				'./_HTML/src/svg-sprite/simple-icons/*.svg'
			],
			destIcons: path.join(paths.assets, '/images/sprites/'),
			destList: './_HTML/src/ejs/_requires/data/', // путь также используется в задаче 'ejs-markup'
			listName: 'svg-list'
		};

		const options = {
			// gulp-cheerio
			cheerio: {
				run ($) {
					$('symbol').each((i, symbol) => svgList.push($(symbol)));
				},
				parserOptions: {
					xmlMode: true
				}
			},
			// gulp-cheerio
			cheerioNotFromParser: {
				run ($) {
					$('[fill]').removeAttr('fill');
					$('[stroke]').removeAttr('stroke');
					$('[style]').removeAttr('style');
				},
				parserOptions: {
					xmlMode: true
				}
			},
			// gulp-svgmin
			svgmin: {
				js2svg: {
					pretty: true
				}
			},
			// gulp-svg-sprite
			svgSprite: {
				svg: {
					namespaceIDs: false
				},
				shape: {
					transform: [{
						svgo: {
							plugins: [{
								cleanupIDs: false
							}]
						}
					}
					]
				},
				mode: {
					symbol: {
						sprite: '../icons'
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, svgList);
	},

	/**
	 * Рендер ejs разметки
	 * @name gulp ejs-markup
	 * @global
	 */
	'ejs-markup' () {
		const taskName = 'ejs-markup';
		const gulpTask = require('./_HTML/system/tasks/ejs');
		const lodash = require('lodash');
		const beautify = require('./_HTML/system/utils/beautify');

		const ejsFileWatcher = watchAndTouch(gulp);

		const jsdom = require('jsdom');
		const {JSDOM} = jsdom;
		const {document} = (
			new JSDOM(`...`)
		).window;

		const taskPaths = {
			src: [
				'./_HTML/src/ejs/hidden/**/*.ejs',
				'./_HTML/src/ejs/*.ejs'
			],
			base: './_HTML/src/ejs/',
			dest: paths.markup
		};

		const options = {
			ejs: {
				layouts: './_HTML/src/ejs/_layouts',
				widgets: './_HTML/src/ejs/_widgets',
				includes: './_HTML/src/ejs/_includes',
				requires: './_HTML/src/ejs/_requires', // путь также используется в задаче 'svg-sprite'
				compileDebug: argv.verbose && argv.debug,
				showHistory: argv.debug,
				showHistoryOnCrash: argv.verbose || argv.debug,
				extname: '.html',
				delimiter: '%',
				localsName: 'app',
				locals: {
					createEl (tag = 'div') {
						return document.createElement(tag);
					},
					createElSVG (qualifiedName = 'svg') {
						return document.createElementNS('http://www.w3.org/2000/svg', qualifiedName);
					},
					data: {
						WezomCMS,
						pkg: lodash.cloneDeep(pkg),
						argv: lodash.cloneDeep(argv),
						paths: lodash.cloneDeep(paths),
						ejsPaths: {
							localFolder: localFolder(),
							cwd: process.cwd(),
							components: path.join(process.cwd(), './_HTML/frontend-components'),
							ejsCwd: path.join(process.cwd(), './_HTML/src/ejs/'),
							includes: './_HTML/src/ejs/_includes'
						}
					},
					module: {
						logger,
						notify,
						beautify
					}
				},
				afterRender (markup, ...args) {
					if (argv.watch) {
						let sources = args[1];
						let filePath = sources.shift();
						ejsFileWatcher(filePath, filePath, sources);
					}

					if (argv.production) {
						return beautify(markup);
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Трансфер статических файлов разметки
	 * @name gulp ejs-assets
	 * @global
	 */
	'ejs-assets' () {
		const taskName = 'ejs-assets';
		const gulpTask = require('./_HTML/system/tasks/assets');

		const taskPaths = {
			src: [
				'./_HTML/src/ejs/*.!(ejs)',
				'./_HTML/src/ejs/.*',
				'./_HTML/src/ejs/hidden/**/*.!(ejs)',
				'./_HTML/src/ejs/hidden/**/.*',
				'./_HTML/frontend-components/**/ejs/*.!(ejs)',
				'./_HTML/frontend-components/**/ejs/hidden/**/*.!(ejs)',
				'./_HTML/frontend-components/**/ejs/.*',
				'./_HTML/frontend-components/**/ejs/hidden/**/.*'
			],
			dest: paths.markup,
			base: './_HTML/src/ejs/',
			baseReplace: /^.*(\\|\/)ejs(\\|\/)/
		};

		const options = {
			imageminPlugins: {
				gifsicle: {
					interlaced: true,
					optimizationLevel: 3
				},
				jpegtran: {
					progressive: true
				},
				optipng: {
					optimizationLevel: 5
				},
				svgo: {
					plugins: [{
						cleanupAttrs: true
					}]
				}
			},
			imageminOptions: {
				verbose: true
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Очистка директории разметки
	 * @name gulp ejs-clear
	 * @global
	 */
	'ejs-clear' () {
		const taskName = 'ejs-clear';
		const gulpTask = require('./_HTML/system/tasks/clear');
		const askBeforeDelete = !~argv.define.indexOf('no-ask-before-delete');
		const taskPaths = {
			src: paths.markup
		};
		return gulpTask(taskName, taskPaths, askBeforeDelete);
	},

	/**
	 * Линтинг скриптов разметки
	 * @name gulp ejs-lint
	 * @global
	 */
	'ejs-lint' () {
		const taskName = 'ejs-lint';
		const gulpTask = require('./_HTML/system/tasks/eslint');

		const taskPaths = {
			src: [
				'./_HTML/src/ejs/_requires/**/*.js',
				'./_HTML/frontend-components/**/ejs/_requires/**/*.js'
			]
		};

		const options = {
			eslint: {
				configFile: './.eslintrc',
				globals: [
					'app'
				]
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * EJS документация
	 * @name gulp ejs-docs
	 * @global
	 */
	'ejs-docs' () {
		const taskName = 'ejs-docs';
		const gulpTask = require('./_HTML/system/tasks/jsdoc');

		const taskPaths = {
			src: [
				'./_HTML/system/docs-assets/ejs/index.md',
				'./_HTML/src/ejs/_requires/**/*.js',
				'./_HTML/frontend-components/**/ejs/_requires/**/*.js'
			],
			dest: './_HTML/api-docs/ejs'
		};

		const options = {
			jsdoc: {
				source: {
					includePattern: '.+\\.js(docs|x)?$',
					excludePattern: '(^|\\/|\\\\)_'
				},
				tags: {
					allowUnknownTags: true,
					dictionaries: [
						'jsdoc',
						'closure'
					]
				},
				opts: {
					encoding: 'utf8',
					template: './node_modules/jsdoc-simple-theme/',
					recurse: true,
					destination: taskPaths.dest,
					debug: argv.debug,
					verbose: argv.verbose,
					tutorials: './_HTML/system/docs-assets/ejs/tutorials'
				},
				plugins: [
					'plugins/markdown',
					'./node_modules/jsdoc-export-default-interop/dist/index',
					'./node_modules/jsdoc-ignore-code/index',
					'./node_modules/jsdoc-sourcecode-tag/index'
				],
				markdown: {
					parser: 'gfm',
					hardwrap: true
				},
				templates: {
					systemName: 'EJS API docs',
					cleverLinks: false,
					monospaceLinks: false,
					default: {
						outputSourceFiles: true,
						layoutFile: './node_modules/jsdoc-simple-theme/tmpl/layout.tmpl'
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src.concat([
				'./_HTML/system/docs-assets/ejs/tutorials/*.*'
			])
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Сканирование тестов `modernizr` и построение файла библиотеки
	 * @name gulp modernizr
	 * @global
	 */
	'modernizr' () {
		const taskName = 'modernizr';
		const gulpTask = require('./_HTML/system/tasks/modernizr');

		const taskPaths = {
			src: [
				path.join(paths.assets, '/css/**/*.css'),
				path.join(paths.assets, '/js/**/*.js'),
				'!' + path.join(paths.assets, '/js/modernizr.js')
			],
			dest: path.join(paths.assets, '/js/')
		};

		const options = {
			// gulp-modernizr-wezom
			modernizr: {
				customTests: './_HTML/system/modernizr-tests/',
				options: [
					'addTest',
					'setClasses',
					'mq'
				],
				tests: [
					'touchevents',
					'mobiledevice'
				],
				excludeTests: [
					// 'opacity'
				]
			},
			// gulp-uglify
			uglify: {
				mangle: {
					reserved: ['Modernizr']
				},
				output: {
					comments: false
				},
				compress: {
					warnings: true
				}
			}
		};

		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Компиляция критикал скриптов
	 * @name gulp js-critical
	 * @global
	 */
	'js-critical' () {
		const taskName = 'js-critical';
		const gulpTask = require('./_HTML/system/tasks/js');

		const taskPaths = {
			src: [
				'./_HTML/src/js/critical/**/*.js',
				'./_HTML/frontend-components/**/js/critical/**/*.js'
			],
			dest: path.join(paths.assets, '/js/critical/')
		};

		const options = {
			// gulp-babel
			babel: {},
			// gulp-uglify
			uglify: {
				mangle: {
					reserved: ['Modernizr']
				},
				output: {
					comments: false
				},
				compress: {
					warnings: true
				}
			},
			// gulp-include
			include: {
				extension: 'js',
				hardFail: true,
				includePaths: [
					path.join(process.cwd(), './node_modules/'),
					path.join(process.cwd(), './_HTML/src/js/')
				]
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync, false, true);
	},

	/**
	 * Трансфер статических файлов скриптов
	 * @name gulp js-assets
	 * @global
	 */
	'js-assets' () {
		const taskName = 'js-assets';
		const gulpTask = require('./_HTML/system/tasks/assets');

		const taskPaths = {
			src: [
				'./_HTML/src/js/static/**/*.*',
				'./_HTML/frontend-components/**/js/static/**/*.*'
			],
			dest: path.join(paths.assets, '/js/static'),
			base: './_HTML/src/js/static/',
			baseReplace: /^.*(\\|\/)js(\\|\/)static(\\|\/)/
		};

		const options = {
			imageminPlugins: {
				gifsicle: {
					interlaced: true,
					optimizationLevel: 3
				},
				jpegtran: {
					progressive: true
				},
				optipng: {
					optimizationLevel: 5
				},
				svgo: {
					plugins: [{
						cleanupAttrs: true
					}]
				}
			},
			imageminOptions: {
				verbose: true
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Очистка директории скриптов
	 * @name gulp js-clear
	 * @global
	 */
	'js-clear' () {
		const taskName = 'js-clear';
		const gulpTask = require('./_HTML/system/tasks/clear');
		const askBeforeDelete = !~argv.define.indexOf('no-ask-before-delete');
		const taskPaths = {
			src: path.join(paths.assets, '/js/')
		};
		return gulpTask(taskName, taskPaths, askBeforeDelete);
	},

	/**
	 * Линтинг скриптов разработки
	 * @name gulp js-lint
	 * @global
	 */
	'js-lint' () {
		const taskName = 'js-lint';
		const gulpTask = require('./_HTML/system/tasks/eslint');

		const taskPaths = {
			src: [
				'./_HTML/src/js/**/*.js',
				'./_HTML/frontend-components/**/js/**/*.js',
				'!./_HTML/src/js/static/**',
				'!./_HTML/src/js/_vendors/**',
				'!./_HTML/frontend-components/**/js/_vendors/**',
				'!./_HTML/frontend-components/**/js/static/**/**'
			]
		};

		const options = {
			eslint: {
				configFile: './.eslintrc',
				globals: [
					'$', 'jQuery',
					'IS_DEVELOP',
					'IS_PRODUCTION',
					'IS_FTP'
				],
				envs: ['browser']
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * JavaScript API документация
	 * @name gulp js-docs
	 * @global
	 */
	'js-docs' () {
		const taskName = 'js-docs';
		const gulpTask = require('./_HTML/system/tasks/jsdoc');

		const taskPaths = {
			src: [
				'./_HTML/system/docs-assets/js/index.md',
				'./_HTML/src/js/**/*.js',
				'./_HTML/frontend-components/**/js/**/*.js',
				'!./_HTML/src/js/static/**',
				'!./_HTML/src/js/_vendors/**',
				'!./_HTML/frontend-components/**/js/_vendors/**',
				'!./_HTML/frontend-components/**/js/static/**/**'
			],
			dest: './_HTML/api-docs/js'
		};

		const options = {
			jsdoc: {
				source: {
					includePattern: '.+\\.js(docs|x)?$',
					excludePattern: '(^|\\/|\\\\)_'
				},
				tags: {
					allowUnknownTags: true,
					dictionaries: [
						'jsdoc',
						'closure'
					]
				},
				opts: {
					encoding: 'utf8',
					template: './node_modules/jsdoc-simple-theme/',
					recurse: true,
					destination: taskPaths.dest,
					debug: argv.debug,
					verbose: argv.verbose,
					tutorials: './_HTML/system/docs-assets/js/tutorials'
				},
				plugins: [
					'plugins/markdown',
					'./node_modules/jsdoc-export-default-interop/dist/index',
					'./node_modules/jsdoc-ignore-code/index',
					'./node_modules/jsdoc-sourcecode-tag/index'
				],
				markdown: {
					parser: 'gfm',
					hardwrap: true
				},
				templates: {
					systemName: 'JavaScript API docs',
					cleverLinks: false,
					monospaceLinks: false,
					default: {
						outputSourceFiles: true,
						layoutFile: './node_modules/jsdoc-simple-theme/tmpl/layout.tmpl'
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Рендер стилей
	 * @name gulp sass-main
	 * @global
	 */
	'sass-main' () {
		const taskName = 'sass-main';
		const gulpTask = require('./_HTML/system/tasks/sass');
		const sassFileWatcher = watchAndTouch(gulp);

		const taskPaths = {
			src: ['./_HTML/src/sass/*.scss'],
			dest: path.join(paths.assets, '/css/')
		};

		const options = {
			sass: {
				includePaths: [
					'./node_modules/',
					'./_HTML/frontend-components/'
				],
				addVariables: {
					argv: {
						production: argv.production,
						ftp: argv.ftp
					}
				},
				afterRender (result, file) {
					if (argv.watch) {
						let filePath = file.path;
						let sources = result.stats.includedFiles;
						if (sassFileWatcher(filePath, filePath, sources)) {
							logger('cyan', `New imports for ${file.stem}.scss [${sources.length}]`);
						}
					}
				}
			},
			postcss: [
				require('autoprefixer')({
					browsers: [
						'> 1%',
						'last 2 versions',
						'ie 11'
					],
					cascade: false
				}),
				require('css-mqpacker')({
					sort: require('sort-css-media-queries')
				})
			]
		};

		if (argv.production) {
			options.postcss.push(
				require('cssnano')({
					zindex: false,
					autoprefixer: false,
					reduceIdents: false,
					discardUnused: false,
					discardComments: {
						removeAll: true
					}
				})
			);
		}

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync, true);
	},

	/**
	 * Рендер критикал стилей
	 * @name gulp sass-critical
	 * @global
	 */
	'sass-critical' () {
		const taskName = 'sass-critical';
		const gulpTask = require('./_HTML/system/tasks/sass');
		const sassFileWatcher = watchAndTouch(gulp);

		const taskPaths = {
			src: [
				'./_HTML/src/sass/critical/**/*.scss',
				'./_HTML/frontend-components/**/sass/critical/**/*.scss'
			],
			dest: path.join(paths.assets, '/css/critical/')
		};

		const options = {
			sass: {
				includePaths: [
					'./node_modules/',
					'./_HTML/frontend-components/'
				],
				addVariables: {
					argv: {
						production: argv.production,
						ftp: argv.ftp
					}
				},
				afterRender (result, file) {
					if (argv.watch) {
						let filePath = file.path;
						let sources = result.stats.includedFiles;
						if (sassFileWatcher(filePath, filePath, sources)) {
							logger('cyan', `New imports for ${file.stem}.scss [${sources.length}]`);
						}
					}
				}
			},
			postcss: [
				require('autoprefixer')({
					browsers: [
						'> 1%',
						'last 2 versions',
						'ie 11'
					],
					cascade: false
				}),
				require('css-mqpacker')({
					sort: require('sort-css-media-queries')
				}),
				require('cssnano')({
					zindex: false,
					autoprefixer: false,
					discardUnused: false,
					reduceIdents: false,
					discardComments: {
						removeAll: true
					}
				})
			]
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Трансфер статических файлов стилей
	 * @name gulp sass-assets
	 * @global
	 */
	'sass-assets' () {
		const taskName = 'sass-assets';
		const gulpTask = require('./_HTML/system/tasks/assets');

		const taskPaths = {
			src: [
				'./_HTML/src/sass/**/*.!(scss)',
				'./_HTML/frontend-components/**/sass/**/*.!(scss)',
				'!./_HTML/src/sass/_vendors/**',
				'!./_HTML/frontend-components/**/sass/_vendors/**'
			],
			dest: path.join(paths.assets, '/css/'),
			base: './_HTML/src/sass/',
			baseReplace: /^.*(\\|\/)sass(\\|\/)/
		};

		const options = {
			imageminPlugins: {
				gifsicle: {
					interlaced: true,
					optimizationLevel: 3
				},
				jpegtran: {
					progressive: true
				},
				optipng: {
					optimizationLevel: 5
				},
				svgo: {
					plugins: [{
						cleanupAttrs: true
					}]
				}
			},
			imageminOptions: {
				verbose: true
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Очистка директории стилей
	 * @name gulp sass-clear
	 * @global
	 */
	'sass-clear' () {
		const taskName = 'sass-clear';
		const gulpTask = require('./_HTML/system/tasks/clear');
		const askBeforeDelete = !~argv.define.indexOf('no-ask-before-delete');
		const taskPaths = {
			src: path.join(paths.assets, '/css/')
		};
		return gulpTask(taskName, taskPaths, askBeforeDelete);
	},

	/**
	 * Линтинг scss стилей разработки
	 * @name gulp sass-lint
	 * @global
	 */
	'sass-lint' () {
		const taskName = 'sass-lint';
		const gulpTask = require('./_HTML/system/tasks/sass-lint');

		const taskPaths = {
			src: [
				'./_HTML/src/sass/**/*.scss',
				'./_HTML/frontend-components/**/sass/**/*.scss',
				'!./_HTML/src/sass/critical/generated/**',
				'!./_HTML/src/sass/_vendors/**',
				'!./_HTML/frontend-components/**/sass/_vendors/**'
			]
		};

		const options = {
			sassLint: {
				options: {
					configFile: './.sass-lint.yml'
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Sass документация
	 * @name gulp sass-docs
	 * @global
	 */
	'sass-docs' () {
		const taskName = 'sass-docs';
		const gulpTask = require('./_HTML/system/tasks/sassdoc');

		const taskPaths = {
			src: [
				'./_HTML/src/sass/**/*.scss',
				'./_HTML/frontend-components/**/sass/**/*.scss',
				'!./_HTML/src/sass/critical/generated/**',
				'!./_HTML/src/sass/_vendors/**',
				'!./_HTML/frontend-components/**/sass/_vendors/**'
			],
			dest: './_HTML/api-docs/sassdoc'
		};

		const options = {
			sassdoc: {
				verbose: argv.verbose,
				dest: taskPaths.dest,
				package: require('./package.json'),
				display: {
					access: [
						'public',
						'private'
					],
					alias: true,
					watermark: true
				},
				groups: {
					'undefined': 'Без группы'
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Туториалы
	 * @name gulp sass-tutorials
	 * @global
	 */
	'sass-tutorials' () {
		const taskName = 'sass-tutorials';
		const gulpTask = require('./_HTML/system/tasks/jsdoc');

		const taskPaths = {
			src: [
				'./_HTML/system/docs-assets/sass-tutorials/index.md',
				'./_HTML/system/docs-assets/sass-tutorials/index.js'
			],
			dest: './_HTML/api-docs/sass-tutorials'
		};

		const options = {
			jsdoc: {
				source: {
					includePattern: '.+\\.js(docs|x)?$',
					excludePattern: '(^|\\/|\\\\)_'
				},
				tags: {
					allowUnknownTags: true,
					dictionaries: [
						'jsdoc',
						'closure'
					]
				},
				opts: {
					encoding: 'utf8',
					template: './node_modules/jsdoc-simple-theme/',
					recurse: true,
					destination: taskPaths.dest,
					debug: argv.debug,
					verbose: argv.verbose,
					tutorials: './_HTML/system/docs-assets/sass-tutorials/tutorials'
				},
				plugins: [
					'plugins/markdown',
					'./node_modules/jsdoc-export-default-interop/dist/index',
					'./node_modules/jsdoc-ignore-code/index',
					'./node_modules/jsdoc-sourcecode-tag/index'
				],
				markdown: {
					parser: 'gfm',
					hardwrap: true
				},
				templates: {
					systemName: 'SASS tutorials',
					cleverLinks: false,
					monospaceLinks: false,
					default: {
						outputSourceFiles: true,
						layoutFile: './node_modules/jsdoc-simple-theme/tmpl/layout.tmpl'
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Трансфер статических файлов
	 * @name gulp static-assets
	 * @global
	 */
	'static-assets' () {
		const taskName = 'static-assets';
		const gulpTask = require('./_HTML/system/tasks/assets');

		const taskPaths = {
			src: [
				'./_HTML/src/assets/**/*.*',
				'./_HTML/src/assets/**/.*',
				'./_HTML/frontend-components/**/assets/**/*.*',
				'./_HTML/frontend-components/**/assets/**/.*'
			],
			dest: paths.assets,
			baseReplace: /^.*assets\\/
		};

		const options = {
			imageminPlugins: {
				gifsicle: {
					interlaced: true,
					optimizationLevel: 3
				},
				jpegtran: {
					progressive: true
				},
				optipng: {
					optimizationLevel: 5
				},
				svgo: {
					plugins: [{
						cleanupAttrs: true
					}]
				}
			},
			imageminOptions: {
				verbose: true
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Трансфер favicon.ico в корень проекта
	 * @name gulp static-assets
	 * @global
	 */
	'favicon-ico' () {
		const taskName = 'favicon-ico';
		const gulpTask = require('./_HTML/system/tasks/assets');

		const taskPaths = {
			src: './_HTML/src/assets/favicons/favicon.ico',
			dest: paths.root
		};

		const options = {
			imageminPlugins: {},
			imageminOptions: {}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Очистка директории ститеческих файлов
	 * @name gulp static-clear
	 * @global
	 */
	'static-clear' () {
		const taskName = 'static-clear';
		const gulpTask = require('./_HTML/system/tasks/clear');
		const askBeforeDelete = !~argv.define.indexOf('no-ask-before-delete');
		const taskPaths = {
			src: [
				path.join(paths.assets, '/**/'),
				path.join(paths.assets, '/*.*'),
				path.join(paths.assets, '/.*'),
				'!' + path.join(paths.assets, '/'),
				'!' + path.join(paths.assets, '/css/**/'),
				'!' + path.join(paths.assets, '/js/**/')
			]
		};
		return gulpTask(taskName, taskPaths, askBeforeDelete);
	},

	/**
	 * Линтинг скриптов сборки проекта
	 * @name gulp system-lint
	 * @global
	 */
	'system-lint' () {
		const taskName = 'system-lint';
		const gulpTask = require('./_HTML/system/tasks/eslint');

		const taskPaths = {
			src: [
				'./gulpfile.js',
				'./webpack.config.js',
				'./config.html.js',
				'./config.critical.js',
				'./_HTML/system/**/*.js'
			]
		};

		const options = {
			eslint: {
				configFile: './.eslintrc',
				globals: [
					'app'
				]
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * API документация по файлам сборки
	 * @name gulp system-docs
	 * @global
	 */
	'system-docs' () {
		const taskName = 'system-docs';
		const gulpTask = require('./_HTML/system/tasks/jsdoc');

		const taskPaths = {
			src: [
				'./_HTML/system/docs-assets/system/index.md',
				'./gulpfile.js',
				'./webpack.config.js',
				'./config.html.js',
				'./config.critical.js',
				'./_HTML/system/**/*.js'
			],
			dest: './_HTML/api-docs/system'
		};

		const options = {
			jsdoc: {
				source: {
					includePattern: '.+\\.js(docs|x)?$',
					excludePattern: '(^|\\/|\\\\)_'
				},
				tags: {
					allowUnknownTags: true,
					dictionaries: [
						'jsdoc',
						'closure'
					]
				},
				opts: {
					encoding: 'utf8',
					template: './node_modules/jsdoc-simple-theme/',
					recurse: true,
					destination: taskPaths.dest,
					debug: argv.debug,
					verbose: argv.verbose,
					tutorials: './_HTML/system/docs-assets/system/tutorials'
				},
				plugins: [
					'plugins/markdown',
					'./node_modules/jsdoc-export-default-interop/dist/index',
					'./node_modules/jsdoc-ignore-code/index',
					'./node_modules/jsdoc-sourcecode-tag/index'
				],
				markdown: {
					parser: 'gfm',
					hardwrap: true
				},
				templates: {
					systemName: 'System API docs',
					cleverLinks: false,
					monospaceLinks: false,
					default: {
						outputSourceFiles: true,
						layoutFile: './node_modules/jsdoc-simple-theme/tmpl/layout.tmpl'
					}
				}
			}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Создание главной страницы для разделов документации
	 * @name gulp docs-index
	 * @global
	 */
	'docs-index' () {
		const taskName = 'docs-index';
		const gulpTask = require('./_HTML/system/tasks/assets');

		const taskPaths = {
			src: [
				'./_HTML/system/docs-assets/index/**/*.*'
			],
			dest: './_HTML/api-docs/'
		};

		const options = {
			imageminPlugins: {},
			imageminOptions: {}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync);
	},

	/**
	 * Выгрузка документации на инкубатор
	 * @name gulp docs-upload
	 * @global
	 */
	'docs-upload' () {
		const taskName = 'docs-upload';
		const gulpTask = require('./_HTML/system/tasks/upload');
		const lodash = require('lodash');

		const taskPaths = {
			src: [
				'./_HTML/api-docs/**/*.*'
			]
		};

		const options = {
			vinylFtp: lodash.merge(ftpPresets.inkubator, {
				remotePath: `www/inkubator.ks.ua/docs/${pkg.projectFolders.inkubator}/`
			})
		};
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Установка вотчей
	 * @name gulp watch
	 * @global
	 */
	'watch' () {
		gulp.task('watch', done => {
			let {list} = watchers;
			if (Object.keys(list).length) {
				for (let task in list) {
					let src = list[task];
					gulp.watch(src, gulp.series(task));
				}
			} else {
				logger('red', 'No list of watchers');
			}
			done();
		});
	},

	/**
	 * Инит сервера browser-sync
	 * @name gulp bs
	 * @global
	 */
	'bs' () {
		gulp.task('bs', done => {
			function setupOptions () {
				let enable = /* WS-REPLACE=>`${data.bs.enable}` */true/* WS-REPLACE-END */;
				let useHost = /* WS-REPLACE=>`${data.bs.host}` */true/* WS-REPLACE-END */;
				let useStatic = /* WS-REPLACE=>`${data.bs.static}` */false/* WS-REPLACE-END */;
				let openOnInit = argv.open ? 'external' : false;

				if (!enable) {
					return null;
				}

				if (useStatic) {
					// параметры статического сервера
					return {
						open: openOnInit,
						server: {
							baseDir: paths.markup
						}
					};
				}

				if (useHost) {
					let folder = localFolder();

					// параметры прокируемого сервера с именнованым хостом
					return {
						open: openOnInit,
						port: 4000,
						host: folder,
						proxy: `http://${folder + paths.toMarkup}`
					};
				}

				// дефолтные параметры инита
				return {
					open: openOnInit,
					port: 4000
				};
			}

			const options = setupOptions();
			if (options === null) {
				logger('red', 'browser-sync - disabled!');
				return done();
			}

			if (argv.bsWebpack) {
				let webpack = require('webpack');
				let webpackDevMiddleware = require('webpack-dev-middleware');
				let WriteFilePlugin = require('write-file-webpack-plugin');

				let notify = require('./_HTML/system/utils/notify');
				let webpackConfig = require('./webpack.config');
				let icon = path.join(process.cwd(), './_HTML/system/notify-icons/webpack.png');
				let wasErrors = false;
				let getEmittedAssets = (assets) => {
					let arr = [];
					for (let chunk in assets) {
						if (assets[chunk].emitted) {
							arr.push(chunk);
						}
					}
					return arr;
				};

				webpackConfig.plugins.push(new WriteFilePlugin());

				if (~argv.define.indexOf('analyzer')) {
					const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
					webpackConfig.plugins.push(new BundleAnalyzerPlugin({
						analyzerMode: options.server ? 'static' : 'server',
						analyzerHost: options.host,
						analyzerPort: options.port,
						reportFilename: 'tmp/analyzer-report.html',
						statsFilename: 'tmp/stats.json',
						generateStatsFile: true
					}));
				}

				let bundler = webpack(webpackConfig);

				bundler.plugin('done', stats => {
					if (stats.hasErrors() || stats.hasWarnings()) {
						wasErrors = true;
						notify.onError('webpack build', stats.toString(), icon);
					} else if (wasErrors) {
						notify.onResolved('webpack build');
						wasErrors = false;
					}
					let assets = getEmittedAssets(stats.compilation.assets);

					if (assets.length) {
						browserSync.reload();
					}
				});

				options.middleware = [
					webpackDevMiddleware(bundler, {
						publicPath: webpackConfig.output.publicPath,
						stats: {
							colors: true
						}
					})
				];
			}
			browserSync.init(options, done);
		});
	},

	/**
	 * Выгрузка проекта верстки на инкубатор
	 * @name gulp ftp-upload
	 * @global
	 */
	'ftp-upload' () {
		const taskName = 'ftp-upload';
		const lodash = require('lodash');
		const gulpTask = require('./_HTML/system/tasks/upload');

		const taskPaths = {
			src: ['./_HTML/tmp/ftp/**/*.*']
		};

		const options = {
			vinylFtp: lodash.merge(ftpPresets.inkubator, {
				remotePath: `www/inkubator.ks.ua/html/${pkg.projectFolders.inkubator}/`
			})
		};
		return gulpTask(taskName, taskPaths, options);
	},

	/**
	 * Дефолтная задача
	 * @name gulp default
	 * @global
	 */
	'default' () {
		let runSeries = mapTasks(runningTasks);
		mapTasks(bgTasks);
		if (runSeries.length) {
			return gulp.task('default', gulp.series(...runSeries));
		}

		gulp.task('default', done => {
			logger('red', '', 'You did not specify a task list, example:');
			logger.command('gulp --run "<task-1>, <task-2>, ...<task-n>"');
			console.log('');
			done();
		});
	},

	/**
	 * Добавление пароля для тестового хостинга
	 * _**Важно!!!** используйте задачу только тестовом хостинге_
	 * _и только в том случае если еще не привязана админка_
	 * @returns {Function}
	 */
	'wezomnet-set-password' () {
		const taskName = 'wezomnet-set-password';
		const gulpTask = require('./_HTML/system/tasks/assets');

		const taskPaths = {
			src: './_HTML/system/wezom-net-password/set/.htaccess',
			dest: './'
		};

		const options = {
			imageminPlugins: {},
			imageminOptions: {}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync, function () {
			logger('blue', '', 'Setting password is done!', '');
		});
	},

	/**
	 * Отключение пароля для тестового хостинга
	 * _**Важно!!!** используйте задачу только тестовом хостинге_
	 * _и только в том случае если еще не привязана админка_
	 * @returns {Function}
	 */
	'wezomnet-unset-password' () {
		const taskName = 'wezomnet-unset-password';
		const gulpTask = require('./_HTML/system/tasks/assets');

		const taskPaths = {
			src: './_HTML/system/wezom-net-password/unset/.htaccess',
			dest: './'
		};

		const options = {
			imageminPlugins: {},
			imageminOptions: {}
		};

		watchers.push({
			taskName,
			src: taskPaths.src
		});
		return gulpTask(taskName, taskPaths, options, browserSync, function () {
			logger('blue', '', 'Unsetting password is done!', '');
		});
	}
};

// ----------------------------------------
// Exports
// ----------------------------------------

if (hasTask(task) !== true && task === undefined) {
	for (let key in gulpTasks) {
		hasTask(key);
	}
}
