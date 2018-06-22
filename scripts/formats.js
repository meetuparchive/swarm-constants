const fs = require('fs');
const path = require('path');
const SD_scssFormat = require('../node_modules/style-dictionary/lib/common/formats')['scss/variables'];

/**
 * StyleDictionary custom formats
 * https://amzn.github.io/style-dictionary/formats_and_templates
 */

// load and keep breakpoint values in memory
// for responsive var value output
const bpProperties = JSON.parse(
		fs.readFileSync(
			path.join(__dirname, '..', 'properties', 'layout', 'breakpoints.json')
		)
	);

// get media query string from size keyword
// (e.g. 's', 'm', 'l')
const getMQBySize = (size) =>
	`only screen and (min-width: ${bpProperties.layout.breakpoint[size].value})`;

// checks if dictionary property belongs to responsive category
const isResponsiveProp = (p) => p.path.includes('responsive');

// generated content warning for top of files
const dateHeader = () =>
	  '/**\n' +
		' * Do not edit directly\n' +
		' * Generated on ' + new Date() + '\n' +
		' */\n\n';


// commonJS module format
// (!) ignores responsive properties
//
// adds every dictionary property to exports
const commonJS = {
	name: 'javascript/commonJS',
	formatter: (dictionary) => dateHeader() + dictionary
		.allProperties
		.filter(prop => prop.attributes.category !== 'responsive')
		.map(prop => `exports.${prop.name} = '${prop.value}';`)
		.join('\n')
};

// CSS Custom properties format
//
// There is some extra complexity here due to support
// for responsive custom properties. A "responsive"
// custom property has a different value at medium
// and large breakpoints. These properties are assigned
// a default value in `:root` with overrides scoped
// to media queries.
//
// A "standard" custom property has only one value,
// and can be assigned in `:root` just once.
const CSSCustomProperties = {
	name: 'css/customProperties',
	formatter: (dictionary) => {
		const { allProperties } = dictionary;
		const lineTab = '\n\t';
		const toCSSRule = (prop, size) => size ?
			`${prop.name}: ${prop.value[size]};`
			: `${prop.name}: ${prop.value};`;

		return dateHeader() + `
/* Default values */
:root {
	${allProperties
		.filter(p => !isResponsiveProp(p))
		.map(p => toCSSRule(p))
		.join(lineTab)
	}
	${allProperties
		.filter(p => isResponsiveProp(p))
		.map(p => toCSSRule(p, 'default'))
		.join(lineTab)
	}
}

/* Medium breakpoint overrides */
@media ${getMQBySize('m')} {
	:root {
		${allProperties
			.filter(p => isResponsiveProp(p))
			.map(p => toCSSRule(p, 'atMedium'))
			.join(lineTab + '\t')
		}
	}
}

/* Large breakpoint overrides */
@media ${getMQBySize('l')} {
	:root {
		${allProperties
			.filter(p => isResponsiveProp(p))
			.map(p => toCSSRule(p, 'atLarge'))
			.join(lineTab + '\t')
		}
	}
}
`
	}
};

// JS Custom properties format
//
// Exports an object with custom property names as keys.
// For responsive properties, we take the "default" value.
//
const JSObjectCustomProperties = {
	name: 'js/customProperties',
	formatter: (dictionary) => {
		const objProps = dictionary.allProperties
			.map(p =>
				`'${p.name}': '${isResponsiveProp(p) ? p.value['default'] : p.value.replace(/'/g, '\"')}',`
			)
			.join('\n\t');
		return dateHeader() + `module.exports = {\n\tcustomProperties: {\n\t${objProps}\n\t}\n}`;
	}
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
	CSSCustomProperties,
	JSObjectCustomProperties,
	colorAttributes,
	scssColorVariables,
	scssVariables
];
