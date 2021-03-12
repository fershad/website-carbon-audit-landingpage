const dev = process.env.NODE_ENV !== 'production';

module.exports = async function() {
    if (dev) {
        return `<meta name="robots" content="noindex, nofollow, noarchive">`;
    }

    return '';
};
