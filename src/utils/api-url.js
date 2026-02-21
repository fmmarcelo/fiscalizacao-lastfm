const BASE_URL = 'https://www.last.fm';
const ENDPOINT_TEMPLATE = '/user/$USER/partial/$INFO?$INFO_date_preset=$PERIOD';

function buildUrl(user, info, period) {
    const endpoint = ENDPOINT_TEMPLATE
        .replace('$USER', user)
        .replaceAll('$INFO', info)
        .replace('$PERIOD', period);
    
    return BASE_URL + endpoint;
}

module.exports = {
    BASE_URL,
    buildUrl
};