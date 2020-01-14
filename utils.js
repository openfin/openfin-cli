const url = require('url');

function fetch(configUrl) {
    const proto = (url.parse(configUrl).protocol.slice(0, -1)) === 'http' ? 'http' : 'https';
    const fetcher = require(proto);

    return new Promise((resolve, reject) => {
        const request = fetcher.get(configUrl, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error(`Failed to load url: ${url}, status code:${response.statusCode}`));
            }
            const body = [];
            response.on('data', (chunk) => {
                body.push(chunk);
            });
            response.on('end', () => resolve(body.join('')));
        });
        request.on('error', (err) => {
            reject(err);
        });
    });

}

function isURL(str) {
    return (typeof str === 'string') && str.lastIndexOf('http') >= 0;
}

function getUuid() {
    return `app-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

module.exports = {
    fetch,
    isURL,
    getUuid
};
