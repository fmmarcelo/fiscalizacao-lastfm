const path = require('node:path');
const { pathExists, getFileContent, writeFile, makeDir } = require('./files');
const { requestEtag } = require('../services/api');

const DIR_PATH = path.join(__dirname, '../../cache');
const FILE_PATH = path.join(DIR_PATH, '/etag');

async function getEtag() {
    if (!pathExists(DIR_PATH)) {
        makeDir(DIR_PATH);
    }

    let etag = pathExists(FILE_PATH) && getFileContent(FILE_PATH);

    if (etag) {
        return etag;
    }

    etag = await requestEtag();

    if (etag) {
        writeFile(FILE_PATH, etag);
        return etag;
    }

    return null;
}

module.exports = {
    getEtag
};