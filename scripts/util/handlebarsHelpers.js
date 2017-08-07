const Color = require('tinycolor2');
const getRgbaString = require('./getRgbaString');


const getInvertedClass = {
	helperName: 'getInvertedClass',

	/**
	 * @param {Array} colorArr - the rgba array to convert
	 * @returns {String} css class name ('inverted' if color is dark)
	 */
	helperFn: colorArr => {
		const brightness = Color(getRgbaString(colorArr)).getBrightness();
		const veryTransparent = colorArr[3] < 0.5;

		return brightness < 160 && !veryTransparent ?
			'inverted'
			: '';
	}
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
	helperFn: arr => {
		if ( arr[3] < 1 ) {
			return getRgbaString(arr);
		} else {
			return `rgb(${arr[0]},${arr[1]},${arr[2]})`;
		}
	}
};

const toSassVar = {
	helperName: 'toSassVar',
	helperFn: color => color.type === 'text' ?
		`$C_text${color.name.charAt(0).toUpperCase() + color.name.slice(1)}`
		: `$C_${color.name}`
};

module.exports = [
	getInvertedClass,
	toHex,
	toRgba,
	toSassVar,
];
