const SD_scssFormat = require('../node_modules/style-dictionary/lib/common/formats')['scss/variables'];
const customProperty = require('./util/customProperty');

/**
 * StyleDictionary custom formats
 * https://amzn.github.io/style-dictionary/formats_and_templates
 */

// generated content warning for top of files
const dateHeader = () =>
	  '/**\n' +
		' * Do not edit directly\n' +
		' * Generated on ' + new Date() + '\n' +
		' */\n\n';


// commonJS module format
// (!) "color" category only
//
// adds every dictionary property to exports
const commonJS = {
	name: 'javascript/commonJS',
	formatter: (dictionary) => dateHeader() + dictionary
		.allProperties
		.filter(prop => prop.attributes.category === "color")
		.map(prop => `exports.${prop.name} = '${prop.value}';`)
		.join('\n')
};

// CSS Custom properties format
//
const customPropertiesCSS = {
	name: 'css/customProperties',
	formatter: (dictionary) =>
		dateHeader() + customProperty.getAllCSSRules(dictionary, false)
};

// SCSS Module custom properties format
//
const customPropertiesCSSModule = {
	name: 'cssModule/customProperties',
	formatter: (dictionary) =>
		dateHeader() + customProperty.getAllCSSRules(dictionary, true)
};

// Color attributes format (JS)
// (!) "color" category only
//
// creates a javascript file that exports a list
// of objects containing meta info for each
// dictionary property
const colorAttributes = {
	name: 'javascript/colorAttributes',
	formatter: (dictionary, platform) => dateHeader() +
		'module.exports = ' +
			JSON.stringify(
				dictionary
					.allProperties
					.filter(p => p.attributes.category === "color")
					.map(p => ({
						name: p.name,
						type: p.attributes.type,
						colorValues: p.attributes.colorValues,
						colorVarNames: p.attributes.colorVarNames,
						originalValue: p.value,
					})),
				null,
				3
			) +
		';'
};

// DEPRECATED
//
// Sass color variables format (SCSS)
// (!) "color" category only
//
// Filters dictionary to produce only color
// variables for our Sass distributution
const scssColorVariables = {
	name: 'scss/colorVariables',
	formatter: (dictionary, platform) => {
		const allProperties = dictionary.allProperties
			.filter(p => p.attributes.category === "color");

		return SD_scssFormat({ allProperties });
	}
};

// Sass variables format (SCSS)
//
// (!) does not emit items of "responsive" category
//     as "responsive" items are handled in the custom
//     properties CSS dist
//
const scssVariables = {
	name: 'scss/variablesCustom',
	formatter: (dictionary, platform) => {
		const allProperties = dictionary.allProperties
			.filter(p => p.attributes.category !== "responsive");

		return SD_scssFormat({ allProperties });
	}
};


module.exports = [
	commonJS,
	customPropertiesCSS,
	customPropertiesCSSModule,
	colorAttributes,
	scssColorVariables,
	scssVariables
];
