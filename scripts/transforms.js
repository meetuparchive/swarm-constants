const Color = require('tinycolor2');
const getRgbaString = require('./util/getRgbaString');
const SD_transforms = require('../node_modules/style-dictionary/lib/common/transforms');

/**
 * Gets object of prop names based on different patterns
 * 
 * @param {Object} prop - the dictionary property
 * @param {Object} opts - options
 * @returns {Object} - calculated prop names by convention key
 */
const getPropNamePatterns = (prop, opts) => {
	const {
		category,
		type,
		item,
	} = prop.attributes;

	const {
		colorPrefix,
		delimiter,
		textDelimiter,
	} = opts;

	return {
		color: `${colorPrefix}${item}`,
		textColor: `${colorPrefix}text${textDelimiter}${capitalizeFirstLetter(item)}`,
		CTI: `${category}${delimiter}${type}${delimiter}${item}`,
		TI: `${type}${delimiter}${item}`,
		CT: `${category}${delimiter}${type}`,
	}
}


/**
 * @function getNameWithWebConvention
 * Name transform helper
 *
 * @param {Object} prop - the dictionary property
 * @param {Object} namePatterns - object containing prop names using different conventions/patterns
 *
 * @returns {String} - property name following web (scss, css) conventions
 */ 
const getNameWithWebConvention = (prop, namePatterns) => {
	const {
		category,
		type,
	} = prop.attributes;

	let name;
	switch(category) {
		case 'color':
			name = (type === 'text') ? namePatterns.textColor : namePatterns.color
			break;
		case 'layout':
			name = namePatterns.TI;
			break;
		case 'responsive':
			name = (type === 'media') ? namePatterns.TI : namePatterns.CT;
			break;
		default:
			name = namePatterns.CTI;
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
// Color transform
// converts color to optimized rgb/rgba
//
const fontNameJS = {
	name: 'value/fontNameJS',
	matcher: prop => prop.attributes.category === 'font',
	type: 'value',
	transformer: (prop, options) => {
		return prop.original.value.replace(/'/g,'\"');
	}
};


//
// Name transform
// converts "cti" object structure to css custom property `--[type]-[colorName]`
//
const customProperty = {
	name: 'name/cti/customProperty',
	type: 'name',
	transformer: (prop, options) => {
		const customPropertyName = getNameWithWebConvention(
			prop, 
			getPropNamePatterns(prop, {
				colorPrefix: 'c-',
				delimiter: '-',
				textDelimiter: '',
			})
		);

		return `--${customPropertyName}`;
	}
};


//
// Name transform
// converts "cti" object structure to css custom property `--[type]-[colorName]`
//
const scssVar = {
	name: 'name/cti/scssVar',
	type: 'name',
	transformer: (prop, options) => 
		getNameWithWebConvention(
			prop,
			getPropNamePatterns(prop, {
				colorPrefix: 'C_',
				delimiter: '-',
				textDelimiter: '',
			})
		)
};

//
// Name transform
// converts "cti" object structure to valid js var `C_COLOR_NAME`
// 
// ignores responsive properties
//
const jsConstant = {
	name: 'name/cti/jsConstant',
	type: 'name',
	transformer: (prop) => {
		const propNames = getPropNamePatterns(prop, {
			colorPrefix: 'C_',
			delimiter: '_',
			textDelimiter: '_',
		});

		// JS constants should be all upper case
		Object.keys(propNames)
			.forEach(k => propNames[k] = propNames[k].toUpperCase().replace(/-/g, '_'));

		// console.dir(propNames);

		return getNameWithWebConvention(prop, propNames);
	}
		
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
	fontNameJS,
	customProperty,
	scssVar,
	jsConstant,
	colorValues,
	colorVarNames
];
