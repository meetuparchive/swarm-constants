const Color = require('tinycolor2');
const getRgbaString = require('./getRgbaString');


const getInvertedClass = {
	helperName: 'getInvertedClass',

	/**
	 * @param {Array} colorArr - the rgba array to convert
	 * @returns {String} css class name ('inverted' if color is dark)
	 */
	 helperFn: colorArr =>
		 Color(getRgbaString(colorArr))
			.isDark() ?
				'inverted'
				: ''
};

const toHex = {
	helperName: 'toHex',

	/**
	 * @param {Array} colorArr
	 * @returns {String} hex6 color string
	 */
	helperFn: colorArr =>
		Color(getRgbaString(colorArr)).toHexString()
};

const toRgba = {
	helperName: 'toRgba',
	helperFn: getRgbaString
};


module.exports = [
	getInvertedClass,
	toHex,
	toRgba,
];
