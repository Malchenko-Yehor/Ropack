/**
 * Документация всех внешних данных,
 * которые приходят с gulp задачи.
 *
 * Аннотации позволят вашей IDE создать корректные связи,
 * а также улучшит быструю нагацию по проекту.
 *
 * @module docs
 * @see module:core
 */

// ----------------------------------------
// компоненты
// ----------------------------------------

/**
 * @namespace frontendComponents
 */

// ----------------------------------------
// app свойства
// ----------------------------------------

/**
 * Контент текущей страницы, для вставки внутри лейаутов.
 * Соответственно свойство доступно только внутри лейаутов!
 * @name body
 * @memberOf app
 * @type {string}
 * @see {@link https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/README-RU.md#localsbody}
 *
 * @see module:core
 */

/**
 * Абсолютный путь к текущей странице рендера в Вашей файловой системе.
 * Независимо от текущего виджета, инклуда лейаута и тд.
 * @name viewPath
 * @memberOf app
 * @type {string}
 * @see {@link https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/README-RU.md#localsviewpath}
 *
 * @see module:core
 */

/**
 * Флаг, изменился ли файл после последнего обращения к нему.
 * Свойство доступно внутри виджетов.
 * На основных страницах рендера и их лейаутах, свойство также доступно, но для них оно всегда будет равно true.
 * @name fileChanged
 * @memberOf app
 * @type {string}
 * @see {@link https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/README-RU.md#localsfilechanged}
 *
 * @see module:core
 */

/**
 * Входящие параметры для текущего виджета.
 * Соответственно свойство доступно только внутри виджетов!
 * @name entry
 * @memberOf app
 * @type {Object}
 * @see {@link https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/README-RU.md#localsentry}
 *
 * @see module:core
 */

/**
 * Список собранных блоков, которые создаются при помощи метода {@link app.block}
 * @name blocks
 * @memberOf app
 * @see module:core
 * @type {Object}
 * @see {@link https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/README-RU.md#localsblocks}
 */

// ----------------------------------------
// app методы
// ----------------------------------------

/**
 * Добавление блока разметки
 * @method block
 * @memberOf app
 * @param {string} blockName - Имя блока, по которому можно будет обратится
 * @param {string} markup - Значение блока
 * @param {string} [mtd='replace'] - Метод указания значения для блока
 * @see {@link https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/README-RU.md#localsblock-blockname-markup--mtd---block}
 *
 * @see module:core
 */

/**
 * Список собранных блоков, которые создаются при помощи метода {@link app.block}
 * @method setLayout
 * @memberOf app
 * @param {string} filePath - Путь к лейауту
 * @see {@link https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/README-RU.md#localssetlayout-filepath}
 *
 * @see module:core
 */

/**
 * Подключение виджета разметки.
 * @method widget
 * @memberOf app
 * @param {string} filePath - Путь к виджету
 * @param {Object|string} [entry={}] - Входящие данные, которые передаются внутрь виджета
 * @param {boolean|Object} [cacheRenderResult=false] - Кешировать результат рендера разметки
 * @param {boolean} [cacheRenderResult=false] - Кешировать результат рендера разметки
 * @returns {string} рендер ejs разметки
 * @see {@link https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/README-RU.md#localswidget-filepath--entry--cacherenderresult--string}
 *
 * @see module:core
 */

/**
 * Подключение модулей из установленных `node_modules`
 * @method requireNodeModule
 * @memberOf app
 * @param {string} moduleName - Имя модуля
 * @returns {*} подключеный модуль
 * @see {@link https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/README-RU.md#localsrequirenodemodule-modulename--}
 *
 * @see module:core
 */

/**
 * Подключение собственных исполняемых js/json файлов с поддержкой CommonJS для экспорта.
 * @method require
 * @memberOf app
 * @param {string} filePath - Путь к файлу
 * @param {string} [folderPath] - подключать файл относительно пути
 * @returns {*} подключеный модуль
 * @see {@link https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/README-RU.md#localsrequire-filepath--}
 *
 * @see module:core
 */

/**
 * Включает текстовый контент файла в Вашу разметку как есть.
 * @method include
 * @memberOf app
 * @param {string} filePath - Путь к файлу
 * @param {string} [folderPath] - подключать файл относительно пути
 * @returns {Object} Объект имеет набор свойств
 *  `changed` - флаг, изменен ли файл
 *  `mtime` - Дата последней модификации файла
 *  `content` - Строка с контентом файла
 *  `toString()` - собственный метод приведения в строку, который возвращает this.content, таким образом если выполнить метод в контексте вставки в разметку - результатом будет сразу контент файла.
 Пример использования
 * @see {@link https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/README-RU.md#localsinclude-filepath--object}
 *
 * @see module:core
 */

// ----------------------------------------
// create
// ----------------------------------------

/**
 * Создание HTML элемента
 * @method createEl
 * @memberOf app
 * @param {string} [tag='div'] - имя создаваемого HTML элемента
 * @returns {HTMLElement}
 *
 * @see module:core
 */

/**
 * Создание SVG элемента
 * @method createElSVG
 * @memberOf app
 * @param {string} [qualifiedName='svg'] - имя создаваемого SVG элемента
 * @param {string} [namespaceURI='http://www.w3.org/2000/svg'] - Строка, которая указывает URI пространства имен
 * @returns {Element}
 *
 * @see module:core
 */

// ----------------------------------------
// module
// ----------------------------------------

/**
 * Хелперы для частых и мелких задач
 * @namespace module
 * @memberOf app
 * @prop {Object} notify
 *
 * @see module:core
 */

/**
 * Пользовательское уведомление
 * @method onDone
 * @memberOf app.module.notify
 * @param {string} title - заголовок уведомления
 * @param {string} message - сообщение
 * @param {string} [icon=path.join(process.cwd(), './system/notify-icons/error.png')]
 *
 * @see module:core
 */

/**
 * Пользовательское уведомление о ошибке
 * @method onError
 * @memberOf app.module.notify
 * @param {string} title - заголовок уведомления
 * @param {string} message - сообщение ошибки
 * @param {string} [icon=path.join(process.cwd(), './system/notify-icons/error.png')]
 *
 * @see module:core
 */

/**
 * Пользовательское уведомление о предупреждении
 * @method onWarn
 * @memberOf app.module.notify
 * @param {string} title - заголовок уведомления
 * @param {string} message - сообщение ошибки
 * @param {string} [icon=path.join(process.cwd(), './system/notify-icons/error.png')]
 *
 * @see module:core
 */

/**
 * Пользовательское уведомление о исправлении ошибки
 * @method onResolved
 * @memberOf app.module.notify
 * @param {string} title - заголовок уведомления
 * @param {string} [message='Good job!'] - сообщение о исправлении ошибки
 * @param {string} [icon=path.join(process.cwd(), './system/notify-icons/error.png')]
 *
 * @see module:core
 */

/**
 * Форматирование разметки
 * @method beautify
 * @memberOf app.module
 * @param {string} markup
 * @return {string} отформатированная разметка
 *
 * @see module:core
 */

/**
 * Уведомление в терминале
 * @method logger
 * @memberOf app.module
 * @param {string} [color="white"]
 * @param {...string} messages
 * @return {string} отформатированная разметка
 *
 * @see module:core
 */

/**
 * Принт данных JSON строкой с подсветкой
 * @method json
 * @memberOf app.module.logger
 * @inner
 * @param {*} data
 * @param {boolean} [asString]
 *
 * @see module:core
 */

// ----------------------------------------
// data
// ----------------------------------------

/**
 * Данные, конфиги и справочники
 * Объект таже имеет внешне определенные свойства, которые приходят из `gulp` задачи
 * @namespace data
 * @memberOf app
 *
 * @see module:core
 */

/**
 * Флаг сборки для Wezom CMS 4.x+
 * @name WezomCMS
 * @memberOf app.data
 * @type {boolean}
 *
 * @see module:core
 */

/**
 * Данные из `package.json` текущего проекта
 * Подробное описание смотрите в `_HTML/package.json`
 * @name pkg
 * @memberOf app.data
 * @type {Object}
 * @prop {string} name
 * @prop {string} version
 * @prop {string} description
 * @prop {string} author
 * @prop {string} license
 * @prop {string} homepage
 * @prop {string} keywords
 * @prop {string} main
 * @prop {Object} projectFolders
 * @prop {Object} scripts
 * @prop {Object} repository
 * @prop {Object} engines
 * @prop {Object} dependencies
 * @prop {Object} devDependencies
 *
 * @see module:core
 */

/**
 * Параметры окружения
 * Подробное описание смотрите в `_HTML/system/config.js`
 * @name argv
 * @memberOf app.data
 * @type {Object}
 * @prop {boolean} ftp
 * @prop {boolean} fix
 * @prop {boolean} forceRun
 * @prop {boolean} verbose
 * @prop {boolean} debug
 * @prop {boolean} bsWebpack
 * @prop {boolean} open
 * @prop {boolean} bs
 * @prop {boolean} notify
 * @prop {boolean} watch
 * @prop {Array|null} run
 * @prop {Array|null} bg
 * @prop {Array|null} define
 * @prop {boolean} production
 *
 * @see module:core
 */

/**
 * Основные пути проекта
 * Подробное описание смотрите в `_HTML/system/config.js`
 * @name paths
 * @memberOf app.data
 * @type {Object}
 * @prop {string} root
 * @prop {string} markup
 * @prop {string} toMarkup браузера
 * @prop {string} media
 * @prop {string} toMedia
 * @prop {string} assets
 * @prop {string} toAssets
 * @prop {string} clearFolders
 *
 * @see module:core
 */

/**
 * Специальные пути для еjs рендера
 * @name ejsPaths
 * @memberOf app.data
 * @type {Object}
 * @prop {string} localFolder - имя локальной директории проекта
 * @prop {string} cwd - Абсолютный путь к текущей рабочей директории сборки всего проекта
 * @prop {string} ejsCwd - Абсолютный путь к текущей рабочей директории ejs
 * @prop {string} includes - путь к папке с инклуд файлами
 *
 * @see module:core
 */

// ----------------------------------------
// el
// ----------------------------------------

/**
 * Экземпляры DOM элементов
 * @namespace el
 * @memberOf app
 * @tutorial app.el
 *
 * @see module:core
 */
