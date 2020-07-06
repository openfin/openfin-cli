const axios = require('axios');

const fetch = async (url) => {
    const response = await axios.get(url);

    if (response.status < 200 || response.status > 399) {
        throw new Error(`Failed to load url: ${url}, status code:${response.status}`);
    } else {
        return response.data;
    }
}

const isURL = (str) => {
    return (typeof str === 'string') && str.lastIndexOf('http') >= 0;
}

const getUuid = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

module.exports = {
    fetch,
    isURL,
    getUuid
};
