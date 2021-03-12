const purgeStyles = require('./src/_11ty/transforms/purge-css')
const htmlMin = require('./src/_11ty/transforms/html-min')
const imgPlaceholder = require('./src/_11ty/transforms/img-placeholder')
const {
  rasterImage,
  svgImage
} = require('./src/_11ty/shortcode/image')
const analytics = require('./src/_11ty/shortcode/analytics')
const noindex = require('./src/_11ty/shortcode/noindex')
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

const dev = process.env.NODE_ENV !== 'production';

module.exports = (eleventyConfig) => {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget(".cache/main.css");
  eleventyConfig.addPassthroughCopy({
    public: './'
  })

  eleventyConfig.setBrowserSyncConfig({
    files: ['_dev/**/*'],
    open: false,
  })

  eleventyConfig.setLiquidOptions({
    dynamicPartials: true
  });

  eleventyConfig.setDataDeepMerge(true)
  // ! Shortcodes
  //* Image shortcodes
  eleventyConfig.addShortcode("image", rasterImage);
  eleventyConfig.addShortcode("svgImage", svgImage);

  //* Add fathom analytics tracking script in build
  eleventyConfig.addShortcode("analytics", analytics)

  //* Shortcode to put noindex metadata into staging site
  eleventyConfig.addShortcode("noindex", noindex)

  // ! Filters


  // ! Collections
  

  // ! Transforms
  //* Inline page CSS & purge all unused CSS per page
  eleventyConfig.addTransform('purge-styles', purgeStyles);
  
  if (!dev) {
    //* Inline critical CSS & purge all unused CSS per page
    eleventyConfig.addTransform('imgPlaceholder', imgPlaceholder);
    //* Minify the HTML
    eleventyConfig.addTransform("htmlmin", htmlMin);
  }

  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://www.websitecarbonaudit.com",
    },
  });

  return {
    dir: {
      input: 'src',
      output: process.env.NODE_ENV !== 'production' ? '_dev' : '_site'
    },
  }
}