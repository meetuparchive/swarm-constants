const Color = require('tinycolor2');
const getRgbaString = require('./util/getRgbaString');

/**
 * StyleDictionary custom transforms
 * https://amzn.github.io/style-dictionary/transforms
 */


//
// Color transform
// converts color to optimized rgb/rgba
//
const optimizedRGBA = {
	name: 'color/optimizedRGBA',
	type: 'value',
	matcher: prop => prop.attributes.category === 'color',
	transformer: (prop, options) => {
		const arr = prop.original.value;

		if ( arr[3] < 1 ) {
			return getRgbaString(arr);
		} else {
			return `rgb(${arr[0]},${arr[1]},${arr[2]})`;
		}
	}
};


//
// Color transform
// converts color to android AARRGGBB hex
//
const androidHex8 = {
	name: 'color/androidHex8',
	type: 'value',
	matcher: prop => prop.attributes.category === 'color',
	transformer: (prop, options) => {
		var str = Color(
			getRgbaString(prop.original.value)
		).toHex8();

		return `#${str.slice(6)}${str.slice(0,6)}`;
	}
};


//
// Name transform
// converts "cti" object structure to sass `$C_[colorName]`
//
const prefixC = {
	name: 'name/cti/prefixC',
	type: 'name',
	matcher: prop => prop.attributes.category === 'color',
	transformer: (prop, options) => `C_${prop.path.pop()}`
};


module.exports = [
	optimizedRGBA,
	androidHex8,
	prefixC,
];
