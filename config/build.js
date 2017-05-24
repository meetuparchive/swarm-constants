import StyleDictionary from 'style-dictionary';

const styleDictionary = StyleDictionary.extend('config.json');

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
