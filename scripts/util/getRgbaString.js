
/**
 * @param {Array} arr - the rgba array to convert
 * @returns {String} valid css rgba string
 */
module.exports = arr => {
	return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`;
};

