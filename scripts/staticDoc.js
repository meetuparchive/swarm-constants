const H = require('handlebars');
const fs = require('fs');
const helpers = require('./util/handlebarsHelpers');

/**
 * Generates static docs from JSON
 *
 * Usage:
 * `node staticDoc '<src dir path>' '<dest dir path>'`
 */

const SRC_DIR = process.argv[2];
const DEST_DIR = process.argv[3];

helpers
	.forEach((h) => {
		Handlebars.regsiterHelper(
			h.helperName,
			h.helperFn
		);
	});

/*
 *fs.writeFileSync(
 *   `${DEST_DIR}doc.html`,
 *   renderFileContent()
 *);
 */
