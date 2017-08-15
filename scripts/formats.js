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

module.exports = [
	commonJS,
];
