const fs = require('fs');
const path = require('path');

// load and keep breakpoint values in memory
// for responsive var value output
const bpProperties = JSON.parse(
		fs.readFileSync(
			path.join(__dirname, '..', '..', 'properties', 'layout', 'breakpoints.json')
		)
	);

/**
 * @function getMQBySize
 *
 * @param {String} size - breakpoint shorthand size (e.g. 's', 'm', 'l')
 * @returns {String} - full media query string
 */
const getMQBySize = (size) =>
	`only screen and (min-width: ${bpProperties.layout.breakpoint[size].value})`;

/**
 * @function getRootSelector
 *
 * @param {Boolean} isModule - flag for CSS Modules
 * @returns {String} - CSS seletor for root element (specificed as global for modules)
 */
const getRootSelector = (isModule) => isModule ?
	':global :root'
	: ':root';

module.exports = {

	/**
	 * @funciton getAllCSSRules
	 * gets full string of CSS rules for defining custom properties
	 *
	 * There is some extra complexity here due to support
	 * for responsive custom properties. A "responsive"
	 * custom property has a different value at medium
	 * and large breakpoints. These properties are assigned
	 * a default value in `:root` with overrides scoped
	 * to media queries.
	 *
	 * @param {Object} dictionary - the style dictionary
	 * @param {Boolean} isModule - flag to use `:global` for CSS Modules
	 */
	getAllCSSRules: (dictionary, isModule) => {
		const { allProperties } = dictionary;
		const lineTab = '\n\t';
		const isResponsiveProp = (p) => p.path.includes('responsive');
		const toCSSRule = (prop, size) => size ?
			`${prop.name}: ${prop.value[size]};`
			: `${prop.name}: ${prop.value};`;

		return `
/* Default values */
${getRootSelector(isModule)} {
	${allProperties
		.filter(p => !isResponsiveProp(p))
		.map(p => toCSSRule(p))
		.join(lineTab)
	}
	${allProperties
		.filter(p => isResponsiveProp(p))
		.map(p => toCSSRule(p, 'default'))
		.join(lineTab)
	}
}

/* Medium breakpoint overrides */
@media ${getMQBySize('m')} {
	${getRootSelector(isModule)} {
		${allProperties
			.filter(p => isResponsiveProp(p))
			.map(p => toCSSRule(p, 'atMedium'))
			.join(lineTab + '\t')
		}
	}
}

/* Large breakpoint overrides */
@media ${getMQBySize('l')} {
	${getRootSelector(isModule)} {
		${allProperties
			.filter(p => isResponsiveProp(p))
			.map(p => toCSSRule(p, 'atLarge'))
			.join(lineTab + '\t')
		}
	}
}
`;
	}
};
