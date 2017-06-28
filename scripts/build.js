const StyleDictionary = require('style-dictionary').extend('./config.json');
const TRANSFORMS = require('./transforms');

TRANSFORMS
	.forEach((t) => {
		console.info(`Registering Transform: '${t.name}'`);
		StyleDictionary.registerTransform(t);
	});

console.info('--------------------------\nBuilding distributions...');
StyleDictionary.buildAllPlatforms();
