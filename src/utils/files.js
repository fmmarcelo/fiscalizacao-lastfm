const fs = require('node:fs');

function pathExists(path) {
    try {
        fs.accessSync(path, fs.constants.R_OK);
        return true;
    } catch (e) {
        return false;
    }
}

function getFileContent(path) {
    try {
        const data = fs.readFileSync(path);
        return data.toString();
    } catch (e) {
        return null;
    }
}

function writeFile(path, content) {
    try {
        fs.writeFileSync(path, content);
        return true;
    } catch (e) {
        return false;
    }
}

function makeDir(path) {
    try {
        fs.mkdirSync(path);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = {
    pathExists,
    getFileContent,
    writeFile,
    makeDir
};