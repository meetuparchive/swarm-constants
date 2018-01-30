const fs = require('fs');
const path = require('path');

/**
 * StyleDictionary custom formats
 * https://amzn.github.io/style-dictionary/formats_and_templates
 */


// template for custom properties format
const templ_customProperties = (ctx) => {
	const bpProperties = JSON.parse(
			fs.readFileSync(
				path.join(__dirname, '..', 'properties', 'layout', 'breakpoints.json')
			)
		);

	const getCustomProperties = (list, size) => list
		.map(p => `${p.name}: ${size ? p.value[size] : p.value};`)
		.join('\n\t');

	const getMQ = (size) =>
		`only screen and (min-width: ${bpProperties.layout.breakpoint[size].value})`;

	const standardItems = ctx
		.filter(p => !p.path.includes('responsive') );

	const responsiveItems = ctx
		.filter(p => p.path.includes('responsive') );


	return `
:root {
	${getCustomProperties(standardItems)}
	${getCustomProperties(responsiveItems, 'default')}
}

/* Medium breakpoint overrides */
@media ${getMQ('m')} {
	:root {
		${getCustomProperties(responsiveItems, 'atMedium')}
	}
}

/* Large breakpoint overrides */
@media ${getMQ('l')} {
	:root {
		${getCustomProperties(responsiveItems, 'atLarge')}
	}
}
`;
};

const dateHeader = () =>
	  '/**\n' +
		' * Do not edit directly\n' +
		' * Generated on ' + new Date() + '\n' +
		' */\n\n';


const commonJS = {
	name: 'javascript/commonJS',
	formatter: (dictionary, platform) => dateHeader() + dictionary
		.allProperties
		.map(prop => `exports.${prop.name} = '${prop.value}';`)
		.join('\n')
};

const customProperties = {
	name: 'css/customProperties',
	formatter: (dictionary, platform) => dateHeader() +
		templ_customProperties(dictionary.allProperties)
};

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

module.exports = [
	commonJS,
	customProperties,
	colorAttributes
];
