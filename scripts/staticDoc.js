const Handlebars = require('handlebars');
const fs = require('fs');
const helpers = require('./util/handlebarsHelpers');

/**
 * Generates static docs from JSON
 *
 * _For now, we're only generating a static doc for colors._
 * A future iteration will accept an argument for `properties/[prop]`
 * to build type-specific docs.
 *
 * Usage:
 * `node staticDoc '<src dir path>' '<dest dir path>'`
 */

const SRC_DIR = process.argv[2];
const DEST_DIR = process.argv[3];

// template context
const context = {
	categories: []
};

/**
 * transforms colors object into an array for
 * template context
 *
 * @param {Object} colors - list of color objects
 * @returns {Array} transformed flattened color objects
 */
const getColorList = colors => {
	return Object.keys(colors)
		.map(k => ({
			name: k,
			value: colors[k].value
		}));
};

/**
 * reads and transforms style-dictionary "category/type/item" object
 * structure into clean color category objects for
 * template context
 *
 * @param {String} f - json file name
 * @returns {Object} native object representing a category of properties
 */
const getColorCategory = f => {
	const catJSON = fs.readFileSync(`${SRC_DIR}/${f}`);
	const catObj = JSON.parse(catJSON).color;
	const catName = Object.keys(catObj)[0];
	const catColors = catObj[catName];

	return {
		name: catName,
		colors: getColorList(catColors),
	};
};

fs.readdirSync(SRC_DIR)
	.filter(f => f.includes('.json'))
	.forEach(f => {
		context.categories.push(getColorCategory(f));
	});

helpers
	.forEach((h) => {
		Handlebars.registerHelper(
			h.helperName,
			h.helperFn
		);
	});

console.warn(JSON.stringify(context, null, 2));

/*
 *fs.writeFileSync(
 *   `${DEST_DIR}doc.html`,
 *   renderFileContent()
 *);
 */
