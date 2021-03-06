'use strict';

/**
 * @file transforms data.
 */

const mongo = require('mongodb');
const sanitize = require('xss-filters');
const {isType} = require('./utils');

const self = module.exports;

/**
* Transform a value according to schema.
* @param {Mixed} value.
* @param {Object} fieldSchema.
* @param {Number} pos - the transform function (in array) to call.
* @return {Object}
*/
self.transformValue = (value, fieldSchema, pos = 0) => {
  value = self.transformString(value, fieldSchema);
  value = self.transformFunction(value, fieldSchema, pos);
  return value;
};

/**
* Call custom transformation function from schema.
* @param {Mixed} value.
* @param {Object} fieldSchema.
* @param {Number} pos - the transform function (in array) to call.
* @return {Object}
*/
self.transformFunction = (value, fieldSchema, pos = 0) => {
  if (fieldSchema.transform[pos]) {
    value = fieldSchema.transform[pos].call(null, value, fieldSchema);
  }
  return value;
};

/**
 * Transforms a String per schema.
 * @param {Mixed} value.
 * @param {Object} fieldSchema.
 * @return {String}
 */
self.transformString = (value, fieldSchema) => {
  if (isType(value, 'string')) {
    if (fieldSchema.trim) {
      value = value.trim();
    }
    if (fieldSchema.lowercase) {
      value = value.toLowerCase();
    }
    if (fieldSchema.uppercase) {
      value = value.toUpperCase();
    }
    if (fieldSchema.sanitize) {
      value = sanitize.inHTMLData(value);
    }
  }
  return value;
};
