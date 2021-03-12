const { baseURL } = require('./site');

module.exports = {
    home: {
        title: 'Home',
        link: `${baseURL}`,
    },
    about: {
        title: 'About',
        link: `${baseURL}/about`,
    },
    carbon: {
        title: 'Carbon',
        link: `${baseURL}/carbon`,
    },
};
