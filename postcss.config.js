const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const nesting = require('postcss-nesting');

module.exports = {
    plugins: [autoprefixer, postcssImport, nesting],
};
