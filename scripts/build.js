const StyleDictionary = require('style-dictionary').extend('./config.json');
const TRANSFORMS = require('./transforms');
const FORMATS = require('./formats');

TRANSFORMS
	.forEach((t) => {
		console.info(`Registering Transform: '${t.name}'`);
		StyleDictionary.registerTransform(t);
	});

FORMATS
	.forEach((f) => {
		console.info(`Registering Format: '${f.name}'`);
		StyleDictionary.registerFormat(f);
	});

console.info('--------------------------\nBuilding distributions...');
StyleDictionary.buildAllPlatforms();
