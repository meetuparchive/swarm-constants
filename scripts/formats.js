/**
 * StyleDictionary custom formats
 * https://amzn.github.io/style-dictionary/formats_and_templates
 */

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
