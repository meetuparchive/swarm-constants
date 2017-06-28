const StyleDictionary = require('style-dictionary').extend('./config.json');
const TRANSFORMS = require('./transforms');

console.warn(TRANSFORMS);

TRANSFORMS
	.forEach((t) => {
		StyleDictionary.registerTransform(t);
	});

StyleDictionary.buildAllPlatforms();
