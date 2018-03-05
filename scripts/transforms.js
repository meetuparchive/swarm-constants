const Color = require('tinycolor2');
const getRgbaString = require('./util/getRgbaString');
const SD_transforms = require('../node_modules/style-dictionary/lib/common/transforms');

/**
 * @function getNameWithWebConvention
 * Name transform helper for SCSS and CSS
 *
 * @param {Object} prop - the dictionary property
 * @param {String} colorPrefix - string to prefix color names (e.g. "C_" or "c-")
 * @param {String} delimiter - delimiter for name parts
 *
 * @returns {String} - property name following web (scss, css) conventions
 */
const getNameWithWebConvention = (prop, delimiter, colorPrefix) => {
	const {
		category,
		type,
		item,
	} = prop.attributes;

	const patterns = {
		color: `${colorPrefix}${item}`,
		textColor: `${colorPrefix}text${capitalizeFirstLetter(item)}`,
		CTI: `${category}-${type}-${item}`,
		TI: `${type}-${item}`,
		CT: `${category}-${type}`,
	};

	let name;
	switch(category) {
		case 'color':
			name = (type === 'text') ? patterns.textColor : patterns.color
			break;
		case 'layout':
			name = patterns.TI;
			break;
		case 'responsive':
			name = (type === 'media') ? patterns.TI : patterns.CT;
			break;
		default:
			name = patterns.CTI;
	}

	return name;
};

/**
 * @param {String} s
 * @returns {String} string with first letter capitalized
 */
const capitalizeFirstLetter = s =>
	s.charAt(0).toUpperCase() + s.slice(1);

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
	transformer: (prop, options) => Color(getRgbaString(prop.original.value))
		.toRgbString()
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
// converts "cti" object structure to css custom property `--[type]-[colorName]`
//
const customProperty = {
	name: 'name/cti/customProperty',
	type: 'name',
	transformer: (prop, options) => `--${getNameWithWebConvention(prop, '-', 'c-')}`
};


//
// Name transform
// converts "cti" object structure to css custom property `--[type]-[colorName]`
//
const scssVar = {
	name: 'name/cti/scssVar',
	type: 'name',
	transformer: (prop, options) => getNameWithWebConvention(prop, '-', 'C_')
};

//
// Name transform
// converts "cti" object structure to valid js var `C_COLOR_NAME`
//
const jsConstant = {
	name: 'name/cti/jsConstant',
	type: 'name',
	matcher: prop => prop.attributes.category === 'color',
	transformer: (prop, options) => prop.attributes.type === 'text' ?
		`C_TEXT_${prop.path.pop().toUpperCase()}`
		: `C_${prop.path.pop().toUpperCase().replace(/\-+/, '_')}`
};

//
// Attribute transform
// adds calculated color values to dictionary object properties
//
const colorValues = {
	name: 'attribute/colorValues',
	type: 'attribute',
	matcher: prop => prop.attributes.category === 'color',
	description: 'Adds "optimized rgba", CSS, Android Hex8, and standard hex values to dictionary properties',
	transformer: (prop) => {
		var C = getRgbaString(prop.original.value);

		return {
			colorValues: {
				rgba: Color(C).toRgbString(),
				hex: Color(C).toHexString(),
				hsv: Color(C).toHsvString(),
				hsl: Color(C).toHslString(),
				androidHex8: androidHex8.transformer(prop)
			}
		}
	}
};

//
// Attribute transform
// adds calculated color var names to dictionary object properties
//
const colorVarNames = {
	name: 'attribute/colorVarNames',
	type: 'attribute',
	matcher: prop => prop.attributes.category === 'color',
	description: 'Adds varName properties to dictionary properties (e.g. "$C_colorname", "var(--color-colorname")',
	transformer: (prop, options) => (
		{
			colorVarNames: {
				android: SD_transforms['name/cti/snake'].transformer(prop, options),
				sass: `$${scssVar.transformer(prop)}`,
				js: jsConstant.transformer(prop),
				customProperty: `var(${customProperty.transformer(prop)})`
			}
		}
	)
};



module.exports = [
	optimizedRGBA,
	androidHex8,
	customProperty,
	scssVar,
	jsConstant,
	colorValues,
	colorVarNames
];
