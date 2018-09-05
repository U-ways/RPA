/* sanitize
============================================================================= */

/** for string values */
function sanitizeString (str) {
  return typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';
}

/** for array values */
function sanitizeArray (arr) {
  return typeof(arr) == 'object' && arr instanceof Array ? arr : [];
}

/** for boolean values */
function sanitizeBoolean (bol) {
  return typeof(bol) == 'boolean' && bol == true ? true : false;
}

/** for number values */
function sanitizeNumber (num) {
  return typeof(num) == 'number' && num % 1 === 0 ? num : 0;
}

/** for object values */
function sanitizeObject (obj) {
  return typeof(obj) == 'object' && obj !== null ? obj : {};
}

/**
 * sanitize commonly used built-in objects.
 * @type {Object}
 */
export const sanitize = {
  string:   sanitizeString,
  array:    sanitizeArray,
  boolean:  sanitizeBoolean,
  number:   sanitizeNumber,
  object:   sanitizeObject,
}
