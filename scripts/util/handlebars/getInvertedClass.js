const Color = require('tinycolor2');
const getRgbaString = require('../getRgbaString');

/**
 * @param {Array} colorArr - the rgba array to convert
 * @returns {String} css class name ('inverted' if color is dark)
 */
module.exports = colorArr => {
	const isDark = Color(getRgbaString(colorArr)).isDark();

	return isDark ?
		'inverted'
		: '';
};

