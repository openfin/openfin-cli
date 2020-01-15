const request = require('request');

function fetch(url) {
    return new Promise((resolve, reject) => {
        request(url, function (error, response, body) {
            if (response.statusCode < 200 || response.statusCode > 399) {
                reject(new Error(`Failed to load url: ${url}, status code:${response.statusCode}`));
            }

            if (error) {
                reject(error);
            }

            resolve(body);
        });
    });
}

function isURL(str) {
    return (typeof str === 'string') && str.lastIndexOf('http') >= 0;
}

function getUuid() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

module.exports = {
    fetch,
    isURL,
    getUuid
};
