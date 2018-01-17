'use strict';

/**
 * Составление `svg` спрайта
 * @module
 * @author Dutchenko Oleg <dutchenko.o.dev@gmail.com>
 * @version 9.1.1
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const path = require('path');
const chalk = require('chalk');
const iF = require('gulp-if');
const through2 = require('through2');
const changed = require('gulp-changed');
const rename = require('gulp-rename');
const cheerio = require('gulp-cheerio');
const svgmin = require('gulp-svgmin');
const svgSprite = require('gulp-svg-sprite');

const {argv} = require('../../../config.html');
const logger = require('../utils/logger');
const notify = require('../utils/notify');
const readParserSymbol = require('../utils/read-parser-symbol');
const CompiledFiles = require('../utils/compiled-files');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Gulp задача
 * @param {string} taskName
 * @param {Object} taskPaths - пути задачи
 * @param {string|Array.<string>} taskPaths.src - исходные файлы
 * @param {string} taskPaths.destIcons - итоговая директория для иконок
 * @param {string} taskPaths.destList - итоговая директория для списка иконок
 * @param {string} taskPaths.listName - имя файла со списком иконок
 *
 * @param {Object} options - параметры для модулей
 * @param {Object} options.svgmin
 * @param {Object} options.svgSprite
 * @param {Object} options.cheerio
 * @param {Object} options.cheerioNotFromParser
 *
 * @param {Object} svgList - Составление списка svg символов
 *
 * @returns {Function}
 */
function task (taskName, taskPaths, options, svgList) {
	let checkChanged = argv.forceRun !== true;
	let notifyFlag = argv.notify;
	let compiledFiles = new CompiledFiles();
	let hasErrors = false;
	let wasErrors = false;
	let icon = path.join(process.cwd(), './_HTML/system/notify-icons/svg.png');
	let saveSvgList = !(~argv.define.indexOf('no-svg-list'));

	/**
	 * Определения файла из директории `from-parser-only`
	 * @param {Object} file
	 * @param {string} file.path - абсолютный путь файла в файловой системе
	 * @returns {boolean}
	 * @private
	 */
	function fromParser (file) {
		return /from-parser-only/i.test(file.path);
	}

	/**
	 * Определения файла НЕ из директории `from-parser-only`
	 * @param {Object} file
	 * @returns {boolean}
	 * @private
	 */
	function notFromParser (file) {
		return !fromParser(file);
	}

	return gulp.task(taskName, done => {
		wasErrors = hasErrors;
		hasErrors = false;
		compiledFiles.reset();
		svgList.reset();

		return gulp.src(taskPaths.src)
			.pipe(through2.obj(
				function (file, enc, cb) {
					let content = file.contents.toString();
					if (/<svg\s/.test(content) && /<\/svg>/.test(content)) {
						return cb(null, file);
					}
					notify.onWarn(taskName, [
						chalk.blue(path.relative(file.cwd, file.path)),
						'has an incorrect SVG structure!',
						'The file will be skipped in the sprite generation!'
					].join('\n'));
					cb(null);
				})
				.on('error', function (err) {
					hasErrors = true;
					notify.onError(`${taskName} [read file content]`, err.message, icon);
					this.emit('end');
				})
			)

			// если символ из парсера
			.pipe(iF(
				fromParser,
				through2.obj(readParserSymbol)
					.on('error', function (err) {
						hasErrors = true;
						notify.onError(`${taskName} [readParserSymbol]`, err.message, icon);
						this.emit('end');
					})
			))

			// если символ НЕ из парсера
			.pipe(iF(
				notFromParser,
				svgmin(options.svgmin)
					.on('error', function (err) {
						hasErrors = true;
						notify.onError(`${taskName} [gulp-svgmin]`, err.message, icon);
						this.emit('end');
					})
			))
			.pipe(iF(
				notFromParser,
				cheerio(options.cheerioNotFromParser)
					.on('error', function (err) {
						hasErrors = true;
						notify.onError(`${taskName} [gulp-cheerio not from parser]`, err.message, icon);
						this.emit('end');
					})
			))

			// собераем все символы
			.pipe(
				svgSprite(options.svgSprite)
					.on('error', function (err) {
						hasErrors = true;
						notify.onError(`${taskName} [gulp-svg-sprite]`, err.message, icon);
						this.emit('end');
					})
			)

			// проверем, изменился контент или нет
			.pipe(iF(
				checkChanged,
				changed(taskPaths.destIcons, {
					hasChanged: changed.compareSha1Digest
				})
			))

			// сохраняем полученный спрайт символов (иконок)
			.pipe(gulp.dest(taskPaths.destIcons))
			.pipe(compiledFiles.pipe())

			// готовим данные для ejs шаблонизатора
			.pipe(
				cheerio(options.cheerio)
					.on('error', function (err) {
						hasErrors = true;
						notify.onError(`${taskName} [gulp-cheerio get svg-list]`, err.message, icon);
						this.emit('end');
					})
			)

			// заменяем контент и переименновываем файл
			.pipe(iF(saveSvgList, through2.obj(function (file, ...args) {
				let cb = args[1];
				file.contents = Buffer.from(svgList.print());
				cb(null, file);
			})))
			.pipe(iF(saveSvgList, rename(path => {
				path.basename = taskPaths.listName;
				path.extname = '.js';
			})))

			// сохраняем полученный список символов (иконок)
			.pipe(iF(saveSvgList, gulp.dest(taskPaths.destList)))
			.pipe(iF(saveSvgList, compiledFiles.pipe()))

			// уведомление
			.pipe(iF(
				notifyFlag,
				notify.onLast(taskName, compiledFiles.list, icon)
			))

			// завершение задачи
			.on('end', () => {
				if (hasErrors) {
					return done();
				} else if (wasErrors) {
					notify.onResolved(taskName);
					wasErrors = false;
				}

				if (!notifyFlag) {
					logger('cyan', `New files: [${compiledFiles.list.length}]`);
				}

				checkChanged = true;
			});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
