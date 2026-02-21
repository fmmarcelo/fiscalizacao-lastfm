const { BASE_URL, buildUrl } = require('../utils/api-url');
const needle = require('needle');

async function requestEtag() {
    try {
        const response = await needle('get', BASE_URL);
        
        const etag = response.headers.etag;

        if (!etag) {
            return null;
        }

        return etag;
    } catch (e) {
        return null;
    }
}

async function fetchMetrics(user, info, period, etag) {
    const url = buildUrl(user, info, period);

    const options = {
        follow_max: 5,
        headers: {
            'If-None-Match': etag
        }
    };

    try {
        const response = await needle('get', url, options);

        if (response.statusCode === 406) {
            return { status: 'etag' };
        }

        if (response.statusCode !== 200) {
            return { status: false };
        }

        return response.body;
    } catch (e) {
        return { status: false };
    }
}

module.exports = {
    requestEtag,
    fetchMetrics
};