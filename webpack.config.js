'use strict';

/**
 * @fileOverview Основной файл запуска системі сборки `webpack`
 * @author Dutchenko Oleg <dutchenko.o.dev@gmail.com>
 * @version 9.0.4
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const webpack = require('webpack');

const logger = require('./_HTML/system/utils/logger');
const {argv, paths, isWebpack} = require('./config.html');

// ----------------------------------------
// Private
// ----------------------------------------

// Уведомление о старте работ
logger('yellow', '', 'Starting webpack...');

/**
 * Список плагинов для использования
 * @const {Array}
 * @private
 */
const plugins = [
	// не пропускать при ошибках
	new webpack.NoEmitOnErrorsPlugin(),

	// определяем дополнительные флаги,
	// которые будут достпны внутри файлов сборки
	new webpack.DefinePlugin({
		'IS_DEVELOP': JSON.stringify(!argv.production),
		'IS_PRODUCTION': JSON.stringify(argv.production),
		'IS_FTP': JSON.stringify(argv.ftp)
	}),

	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendors',
		minChunks (module) {
			// сюда будут сложенны все модули из:
			// - node_modules/
			// - _HTML/src/js/_vendors/
			let context = module.context;
			return context && (context.indexOf('node_modules') !== -1 || context.indexOf('_vendors') !== -1);
		}
	})
];

/**
 * Список плагинов для postcss лоадера
 * @const {Array}
 * @private
 */
const postсssPlugins = [
	require('autoprefixer')({
		browsers: [
			'> 1%',
			'ie 11'
		],
		cascade: false
	}),
	require('css-mqpacker')({
		sort: require('sort-css-media-queries')
	})
];

/**
 * Составление исключений для babel-loader'а
 * @private
 * @see {@link https://regex101.com/r/VtFXpv/3/}
 * @returns {RegExp}
 */
function excludeBabelLoaderModules () {
	// список модулей который не нужно исключать
	let includeFolders = [
		'custom-jquery-methods',
		'swiper'
	];

	let regexp = new RegExp(`node_modules[\\/|\\\\](?!(${includeFolders.join('|')})).*`);
	// console.log(regexp);
	return regexp;
}

// Если запуск webpack'a на прямую
if (isWebpack) {
	// выводит прогресс в консоль
	plugins.push(new webpack.ProgressPlugin());

	if (~argv.define.indexOf('analyzer')) {
		const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
		plugins.push(new BundleAnalyzerPlugin({
			reportFilename: 'tmp/analyzer-report.html',
			statsFilename: 'tmp/stats.json',
			generateStatsFile: true
		}));
	}
}

// Если продакшн версия
if (argv.production) {
	// добавляем минификатор js
	plugins.push(new webpack.optimize.UglifyJsPlugin({
		sourceMap: true,
		mangle: {
			reserved: ['Modernizr']
		},
		compress: {
			warnings: true
		},
		output: {
			comments: false
		}
	}));

	// добавляем минификатор css
	postсssPlugins.push(
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

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Конфигурация сборки `webpack`
 * @const {Object}
 * @sourceCode
 */
const config = {
	entry: {
		initialize: path.join(process.cwd(), '_HTML/src/js/entry.js')
	},
	output: {
		filename: '[name].js',
		path: path.resolve(process.cwd(), path.join(paths.assets, '/js/')),
		publicPath: path.join(paths.toAssets, '/js/'),
		chunkFilename: `async-modules/[name].js${argv.production ? '?v=[chunkhash]' : ''}`
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: excludeBabelLoaderModules(),
				use: [{
					loader: 'babel-loader'
				}]
			}, {
				test: /\.css$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader',
					options: {
						importLoaders: 1
					}
				}, {
					loader: 'postcss-loader',
					options: {
						plugins: postсssPlugins
					}
				}]
			}, {
				test: /\.scss$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader',
					options: {
						importLoaders: 1
					}
				}, {
					loader: 'postcss-loader',
					options: {
						plugins: postсssPlugins
					}
				}, {
					loader: 'sass-loader',
					options: {
						includePaths: [
							'./node_modules/',
							'./_HTML/src/sass/'
						]
					}
				}]
			}, {
				test: /\.(png|jpg|jpeg|svg|gif)$/,
				use: ['url-loader']
			}
		]
	},
	resolve: {
		modules: [
			'./node_modules/',
			'./_HTML/frontend-components/',
			'./_HTML/src/js'
		]
	},
	plugins: plugins,
	devtool: argv.production ? 'source-map' : 'inline-source-map',
	watch: argv.watch
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = config;
