const StyleDictionary = require('style-dictionary').extend('./config.json');
const Color = require('tinycolor2');

/**
 * @param {Array} arr - the rgba array to convert
 * @returns {String} valid css rgba string
 */
const getRgbaString = arr => {
	return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`;
};

//// rgba(r,g,b,a) for transparent colors
//// rgb(r,g,b) for solid colors
StyleDictionary.registerTransform({
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
});

//// #aarrggbb
StyleDictionary.registerTransform({
	name: 'color/androidHex8',
	type: 'value',
	matcher: prop => prop.attributes.category === 'color',
	transformer: (prop, options) => {
		var str = Color(
			getRgbaString(prop.original.value)
		).toHex8();

		return `#${str.slice(6)}${str.slice(0,6)}`;
	}
});

StyleDictionary.buildAllPlatforms();
