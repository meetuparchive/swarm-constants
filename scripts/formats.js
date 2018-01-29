const fs = require('fs');
const path = require('path');

/**
 * StyleDictionary custom formats
 * https://amzn.github.io/style-dictionary/formats_and_templates
 */


// template for responsive custom properties format
const templ_responsiveProperties = (ctx) => {
	const bp = JSON.parse(
			fs.readFileSync(
				path.join(__dirname, '..', 'properties', 'layout', 'breakpoints.json')
			)
		);

	const getCustomProperties = (size) =>
		ctx.properties
			.map(p => `--${p.path[1]}-${p.name}: ${p.value[size]};`)
			.join('\n\t');

	const getMQ = (size) =>
		`only screen and (min-width: ${bp.layout.breakpoints[size].value})`;


	return `
:root {
	${getCustomProperties('default')}
}

/* Medium breakpoint overrides */
@media ${getMQ('m')} {
	:root {
		${getCustomProperties('atMedium')}
	}
}

/* Large breakpoint overrides */
@media ${getMQ('l')} {
	:root {
		${getCustomProperties('atLarge')}
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
		'\n:root {\n' +
		dictionary
			.allProperties
			.map(p => `\t--${p.name}: ${p.value};`)
			.join('\n') +
		'\n}'
};

const responsiveProperties = {
	name: 'css/responsiveProperties',
	formatter: (dictionary, platform) => dateHeader() +
		templ_responsiveProperties({
			properties: dictionary
				.allProperties
				.filter( p => p.path.includes('responsive') )
		})
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
	responsiveProperties,
	colorAttributes
];
