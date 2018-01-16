/**
 * StyleDictionary custom formats
 * https://amzn.github.io/style-dictionary/formats_and_templates
 */

const jsHeader = () =>
	  '/**\n' +
		' * Do not edit directly\n' +
		' * Generated on ' + new Date() + '\n' +
		' */\n\n';

const commonJS = {
	name: 'javascript/commonJS',
	formatter: (dictionary, platform) => jsHeader() + dictionary
		.allProperties
		.map(prop => `exports.${prop.name} = '${prop.value}';`)
		.join('\n')
};

const colorAttributes = {
	name: 'javascript/colorAttributes',
	formatter: (dictionary, platform) => jsHeader() +
		'module.exports = ' +
			JSON.stringify(
				dictionary
					.allProperties
					.filter(p => p.attributes.category === "color"),
				null,
				2
			) +
		';'
};

module.exports = [
	commonJS,
	colorAttributes
];
