const { fetchMetrics } = require('./services/api');
const { getEtag } = require('./utils/etag');
const { decodeHtmlEntities } = require('./entity-parser');

const attributeGetters = {
    'albums': getAlbumsAttributes,
    'artists': getArtistsAttributes,
    'tracks': getTracksAttributes
}

async function getEntries(user, info, period, callback) {
    let entries = [];

    const etag = await getEtag();

    if (!etag) {
        return callback(entries);
    }

    const metrics = await fetchMetrics(user, info, period, etag);

    if (metrics?.status !== true) {
        return callback(entries);
    }

    const attributeGetter = attributeGetters[info];

    entries = attributeGetter(body);

    callback(entries);
}

function getAlbumsAttributes(body) {
    let titleClassPattern = /grid-items-item-main-text/g;
    let artistClassPattern = /grid-items-item-aux-block/g;
    let playCountPattern = /([\d|,]+) play/;

    let entries = [];

    const nameMatches = [...body.matchAll(titleClassPattern)];
    nameMatches.forEach( function (item) {
        const matchIndex = item.index;
        const titleIndex = body.indexOf('title=', matchIndex);
        const valueStartIndex = body.indexOf('"', titleIndex);
        const valueEndIndex = body.indexOf('"', valueStartIndex + 1);
        const value = body.substring(valueStartIndex + 1, valueEndIndex);

        entries.push(Array.of(decodeHtmlEntities(value), undefined, undefined));
    });

    const artistMatches = [...body.matchAll(artistClassPattern)];
    let i = 0;
    artistMatches.forEach( function (item) {
        const matchIndex = item.index;
        const artistTagEndIndex = body.indexOf('>', matchIndex);

        const valueStartIndex = body.indexOf('>', artistTagEndIndex);
        const valueEndIndex = body.indexOf('<', valueStartIndex + 1);
        const value = body.substring(valueStartIndex + 1, valueEndIndex);

        const playCountTagEndIndex = body.indexOf('<a', valueEndIndex);

        const playCountStartIndex = body.indexOf('>', playCountTagEndIndex);
        const playCountEndIndex = body.indexOf('<', playCountStartIndex + 1);
        const playCount = body.substring(playCountStartIndex + 1, playCountEndIndex);

        const playCountValue = playCount.match(playCountPattern)[1];

        entries[i][1] = decodeHtmlEntities(value);
        entries[i][2] = playCountValue;
        i += 1;
    });

    return entries;
}

function getArtistsAttributes(body) {
    let artistClassPattern = /grid-items-item-main-text/g;
    let playCountClassPattern = /grid-items-item-aux-text/g;
    let playCountPattern = /([\d|,]+) play/;

    let entries = [];

    const nameMatches = [...body.matchAll(artistClassPattern)];
    nameMatches.forEach( function (item) {
        const matchIndex = item.index;
        const titleIndex = body.indexOf('title=', matchIndex);
        const valueStartIndex = body.indexOf('"', titleIndex);
        const valueEndIndex = body.indexOf('"', valueStartIndex + 1);
        const value = body.substring(valueStartIndex + 1, valueEndIndex);

        entries.push(Array.of(decodeHtmlEntities(value), undefined, undefined));
    });

    const artistMatches = [...body.matchAll(playCountClassPattern)];
    let i = 0;
    artistMatches.forEach( function (item) {
        const matchIndex = item.index;
        const artistTagEndIndex = body.indexOf('>', matchIndex);

        const valueStartIndex = body.indexOf('>', artistTagEndIndex);
        const valueEndIndex = body.indexOf('<', valueStartIndex + 1);
        const value = body.substring(valueStartIndex + 1, valueEndIndex);

        const playCountTagEndIndex = body.indexOf('<a', valueEndIndex);

        const playCountStartIndex = body.indexOf('>', playCountTagEndIndex);
        const playCountEndIndex = body.indexOf('<', playCountStartIndex + 1);
        const playCount = body.substring(playCountStartIndex + 1, playCountEndIndex);

        const playCountValue = playCount.match(playCountPattern)[1];

        entries[i][2] = playCountValue;
        i += 1;
    });

    return entries;
}

function getTracksAttributes(body) {
    let titleClassPattern = /chartlist-name/g;
    let artistClassPattern = /chartlist-artist/g;
    let playCountPattern = /([\d|,]+)/;

    let entries = [];

    const nameMatches = [...body.matchAll(titleClassPattern)];
    nameMatches.forEach( function (item) {
        const matchIndex = item.index;
        const titleIndex = body.indexOf('title=', matchIndex);
        const valueStartIndex = body.indexOf('"', titleIndex);
        const valueEndIndex = body.indexOf('"', valueStartIndex + 1);
        const value = body.substring(valueStartIndex + 1, valueEndIndex);

        entries.push(Array.of(decodeHtmlEntities(value), undefined, undefined));
    });

    const artistMatches = [...body.matchAll(artistClassPattern)];
    let i = 0;
    artistMatches.forEach( function (item) {
        const matchIndex = item.index;
        const artistTagEndIndex = body.indexOf('title=', matchIndex);

        const valueStartIndex = body.indexOf('"', artistTagEndIndex);
        const valueEndIndex = body.indexOf('"', valueStartIndex + 1);
        const value = body.substring(valueStartIndex + 1, valueEndIndex);

        const playCountTagEndIndex = body.indexOf('chartlist-count-bar-value', valueEndIndex);

        const playCountStartIndex = body.indexOf('>', playCountTagEndIndex);
        const playCountEndIndex = body.indexOf('<', playCountStartIndex + 1);
        const playCount = body.substring(playCountStartIndex + 1, playCountEndIndex);

        const playCountValue = playCount.match(playCountPattern)[1];

        entries[i][1] = decodeHtmlEntities(value);
        entries[i][2] = playCountValue;
        i += 1;
    });

    return entries;
}

module.exports = {
    getEntries
};