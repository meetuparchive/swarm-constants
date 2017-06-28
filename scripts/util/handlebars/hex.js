const Color = require('tinycolor2');
const getRgbaString = require('../getRgbaString');

/**
 * @param {Array} colorArr
 * @returns {String} hex6 color string
 */
module.exports = colorArr =>
	Color(getRgbaString(colorArr)).toHexString();
