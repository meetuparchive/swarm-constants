const StyleDictionary = require('style-dictionary');

const styleDictionary = StyleDictionary.extend('config/config.json');

styleDictionary.registerTransform({
	name: 'color/rgba',
	type: 'value',
	matcher: prop => prop.attributes.category === 'color',
	transformer: (prop, options) => {
		// TODO: actually do something here
		return prop.original.value;
	}
});

StyleDictionary.buildAllPlatforms();
