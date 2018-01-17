'use strict';

/**
 * Page Visibility API
 * @module
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API}
 * @example
 * import {visibilityProp, visibilityEvent, visibilitySupport} from './page-visibility-api';
 *
 * if (visibilitySupport) {
 *  document.addEventListener(visibilityEvent, () => {
 *      if (document[visibilityProp]) {
 *          // PAUSE your code
 *      } else {
 *          // PLAY your code
 *      }
 *  }, false);
 * }
 */

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Название свойства у `document`
 * Возвращает `true` или `false`
 * @type {string}
 * @example
 * document[visibilityProp] // => true | false
 */
let visibilityProp;

/**
 * Название события
 * @type {string}
 * @example
 * document.addEventListener(visibilityEvent, fn, false);
 */
let visibilityEvent;

if (typeof document.hidden !== 'undefined') {
	visibilityProp = 'hidden';
	visibilityEvent = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
	visibilityProp = 'msHidden';
	visibilityEvent = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
	visibilityProp = 'webkitHidden';
	visibilityEvent = 'webkitvisibilitychange';
}

/**
 * Флаг поддержки Page Visibility API
 * @type {boolean}
 */
let visibilitySupport = typeof document[visibilityProp] !== 'undefined';

// ----------------------------------------
// Exports
// ----------------------------------------

export {visibilityProp, visibilityEvent, visibilitySupport};
