const commonSymbols = {
    'amp': '&',
    'lt': '<',
    'gt': '>',
    'nbsp': ' '
}

function decodeHtmlEntities(s) {
    if (s.match(/&(#?[\w]+);/) === null) {
        return s;
    }

    return s.replace(/&(#?[\w]+);/, (match, capture) => {
        if (capture[0] === '#') {
            const decodedChar = String.fromCharCode(capture.substring(1));
            return decodedChar === '\x00' ? match : decodedChar;
        }

        if (commonSymbols[capture]) {
            return commonSymbols[capture];
        }

        return match;
    });
}

module.exports = {
    decodeHtmlEntities
};