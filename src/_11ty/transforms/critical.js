const { PurgeCSS } = require('purgecss');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';

module.exports = async (content, outputPath) => {
    const styles = path.join(__dirname, `/../../../.cache/css/header.css`);
    const [{ css: output }] = await new PurgeCSS().purge({
        content: [{ raw: content, extension: 'html' }],
        css: [styles],
        safelist: ['no-js', 'js', 'webp', 'avif', 'link--button', 'hidden'],
    });
    const result = `<style>${output}</style>`;
    const pattern = /<\/title>/s;

    return content.replace(pattern, `</title>${result}`);
};
