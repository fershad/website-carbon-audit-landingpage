const Image = require('@11ty/eleventy-img');

const dev = process.env.NODE_ENV !== 'production';

async function rasterImage(src, alt, widths, sizes, loading = 'lazy') {
    const defaultWidths = [300, 600, 1200];
    const defaultFormats = ['jpeg'];
    let srcset;

    if (!dev) {
        defaultFormats.push('webp', 'avif');
    }

    try {
        srcset = widths.split(',');
        srcset = srcset.map(x => +x);
    } catch {
        srcset = defaultWidths;
    }

    const metadata = await Image(src, {
        widths: srcset,
        formats: defaultFormats,
        outputDir: process.env.NODE_ENV === 'production' ? './_site/img/' : './_dev/img/',
    });

    const imageAttributes = {
        alt,
        sizes,
        //! Disable these if you want to lint responsive images during development.
        loading,
        decoding: 'async',
    };

    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
}

async function svgImage(src, alt) {
    const metadata = await Image(src, {
        formats: ['svg'],
        outputDir: process.env.NODE_ENV === 'production' ? './_site/img/svg/' : './_dev/img/svg/',
        urlPath: '/img/svg/',
    });

    const imageAttributes = {
        alt,
        loading: 'lazy',
        decoding: 'async',
    };

    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
}

module.exports = { svgImage, rasterImage };
