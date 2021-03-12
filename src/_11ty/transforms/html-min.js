const htmlmin = require('html-minifier');

module.exports = async (content, outputPath) => {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith('.html')) {
        const minified = htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: false,
            minifyCSS: true,
            minifyJS: true,
        });
        return minified;
    }

    return content;
};
