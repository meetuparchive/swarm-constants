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
 * `node staticDoc`
 */

const SRC_DIR = './properties/color/';
const DEST_DIR = './dist/doc/color/';
const templatePath = './templates/color/index.hbs';

// add custom helpers to Handlebars
helpers
	.forEach((h) => {
		Handlebars.registerHelper(
			h.helperName,
			h.helperFn
		);
	});

const template = Handlebars.compile(
		fs.readFileSync(templatePath, 'utf8')
	);

// template context
const context = {
	categories: []
};

/**
 * transforms colors object into an array for
 * template context
 *
 * @param {Object} colors - list of color objects
 * @param {String} typeName - property type (style-dictionary CTI convention)
 * @returns {Array} transformed flattened color objects
 */
const getColorList = (colors, typeName) => {
	return Object.keys(colors)
		.map(k => ({
			name: k,
			value: colors[k].value,
			type: typeName,
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
const getColorType = f => {
	const catJSON = fs.readFileSync(`${SRC_DIR}/${f}`, 'utf8');
	const catObj = JSON.parse(catJSON).color;
	const typeName = Object.keys(catObj)[0];
	const typeColors = catObj[typeName];

	return {
		name: typeName,
		colors: getColorList(typeColors, typeName),
	};
};

exports.build = () => {
	fs.readdirSync(SRC_DIR)
		.filter(f => f.includes('.json'))
		.forEach(f => {
			context.categories.push(getColorType(f));
		});

	fs.writeFileSync(
		`${DEST_DIR}index.html`,
		template(context)
	);
};
