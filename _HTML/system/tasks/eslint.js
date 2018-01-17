'use strict';

/**
 * Линтинг скриптов
 * @module
 * @author Dutchenko Oleg <dutchenko.o.dev@gmail.com>
 * @version 7.6.1
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const iF = require('gulp-if');
const eslint = require('gulp-eslint');

const {argv} = require('../../../config.html');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Gulp задача
 * @param {string} taskName
 * @param {Object} taskPaths - пути задачи
 * @param {string|Array.<string>} taskPaths.src - исходные файлы
 * @param {Object} options - параметры для модулей
 * @param {Object} options.eslint
 *
 * @returns {Function}
 */
function task (taskName, taskPaths, options) {
	let firstRun = true;
	let failOnError = argv.watch !== true;
	options.eslint.fix = false;

	return gulp.task(taskName, done => {
		return gulp.src(taskPaths.src, {since: firstRun ? 0 : gulp.lastRun(taskName)})
			// линтитнг
			.pipe(eslint(options.eslint))
			// форматирование результат
			.pipe(eslint.format())
			// ошибки в конце всей задчи, если есть
			.pipe(iF(failOnError, eslint.failAfterError()))
			// завершение задачи
			.on('end', () => {
				firstRun = false;
				done();
			});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = task;
