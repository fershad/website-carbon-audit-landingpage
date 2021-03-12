const { PurgeCSS } = require('purgecss');
const path = require('path');
const fs = require('fs');
const stringHash = require('string-hash');

const dev = process.env.NODE_ENV !== 'production';

const siteFolder = !dev ? '_site' : '_dev';

const createFolder = async dir => {
    try {
        await fs.promises.mkdir(dir, { recursive: true });
    } catch (error) {
        console.log(error);
    }
};

module.exports = async (content, outputPath) => {
    const styles = path.join(__dirname, `/../../../.cache/main.css`);
    const pattern = /<\/head>/s;

    if (!dev) {
        if (outputPath.endsWith('.html')) {
            // for (let index = 0; index < sections.length; index++) {
            // const section = sections[index];
            const [{ css: output }] = await new PurgeCSS().purge({
                content: [{ raw: content, extension: 'html' }],
                css: [styles],
                safelist: ['no-js', 'js', 'webp', 'avif', 'link--button'],
            });
            const result = output;

            // Create a unique filename for the uncritical CSS file
            const hashedFilename = `${stringHash(result)}.css`;

            // Create folder in assets for uncritical CSS to live
            await createFolder(path.join(__dirname, `/../../../${siteFolder}/assets/css`));

            // Write uncritical CSS to file
            // Add it to HTML document
            // Return HTML
            await fs.writeFile(
                path.join(__dirname, `/../../../${siteFolder}/assets/css/${hashedFilename}`),
                result,
                function(error, result) {
                    if (error) {
                        console.log(error);
                    }
                }
            );

            const inlineStyle = `<style type="text/css">${result}</style>`;
            const linkToFile = `<link href='/assets/css/${hashedFilename}' rel="stylesheet" media="print" onload="this.media='all'">
        <noscript><link href='/assets/css/${hashedFilename}' rel='stylesheet'></noscript>`;
            return content.replace(pattern, `${inlineStyle}</head>`);
        }
    } else {
        // File destination.txt will be created or overwritten by default.
        fs.copyFile(styles, path.join(__dirname, `/../../../${siteFolder}/assets/css/main.css`), err => {
            if (err) throw err;
        });

        const linkToFile = `<link href="/assets/css/main.css" rel="stylesheet" media="print" onload="this.media='all'">`;
        return content.replace(pattern, `${linkToFile}</head>`);
    }

    return content;
};
