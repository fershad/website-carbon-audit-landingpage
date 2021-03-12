const { JSDOM } = require('jsdom');
const { promisify } = require('util');
const sizeOf = promisify(require('image-size'));
const path = require('path');
const blurryPlaceholder = require('../../utils/blurry-placeholder');

const dev = process.env.NODE_ENV !== 'production';
const outputFolder = !dev ? './_site/' : './_staging/';

const processImage = async (img, outputPath) => {
    let src = img.getAttribute('src');

    if (/^\.+\//.test(src)) {
        // resolve relative URL
        src = `/${path.relative(outputFolder, path.resolve(path.dirname(outputPath), src))}`;
    }
    let dimensions;
    try {
        dimensions = await sizeOf(`${outputFolder}/${src}`);
    } catch (e) {
        console.warn(e.message, src);
        return;
    }
    if (!img.getAttribute('width')) {
        img.setAttribute('width', dimensions.width);
        img.setAttribute('height', dimensions.height);
    }

    if (dimensions.type == 'svg') {
        return;
    }

    if (img.tagName == 'IMG') {
        // Contain the intrinsic to the `--main-width` (width of the main article body)
        // and the aspect ratio times that size. But because images are `max-width: 100%`
        // use the `min` operator to set the actual dimensions of the image as the
        // ceiling 🤯.
        if (!img.getAttribute('data-no-blur')) {
            const containSize = `min(var(--main-width), ${
                dimensions.width
            }px) min(calc(var(--main-width) * ${dimensions.height / dimensions.width}), ${dimensions.height}px)`;

            img.setAttribute(
                'style',
                `background-size:cover;` +
                    `contain-intrinsic-size: ${containSize};` +
                    `background-image:url("${await blurryPlaceholder(src)}")`
            );
        }
    }
};

module.exports = async (rawContent, outputPath) => {
    let content = rawContent;
    if (outputPath && outputPath.endsWith('.html')) {
        const dom = new JSDOM(content);
        const images = [...dom.window.document.querySelectorAll('img')];

        if (images.length > 0) {
            await Promise.all(images.map(i => processImage(i, outputPath)));
            content = dom.serialize();
        }

        return content;
    }

    return content;
};
