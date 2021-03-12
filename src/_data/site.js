const dev = process.env.NODE_ENV !== 'production';
const baseURL = dev ? 'http://localhost:8080' : 'https://websitecarbonaudit.com';

const privacyURL = `${baseURL}/privacy`;

module.exports = { dev, baseURL, privacyURL };
