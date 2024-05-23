#!/usr/bin/env node

const { getEntries } = require('./scrapper');

function showHelp() {
    console.log(`FISCALIZAÇÃO LAST.FM
    Usage: USER [OPTION] [PERIOD]
    List user's top last.fm albums (default), artists or tracks of a given period (default is 7 days).

    Options:
    -A  Show top albums
    -a  Show top artists
    -t  Show top tracks
    -p  Show play count

    Periods:
    -7    Last 7 days
    -30   Last 30 days
    -90   Last 90 days
    -180  Last 180 days
    -365  Last 365 days
    -all  All time
    
    -h  Display help`);
}

const argv = process.argv;

if (argv.length < 3 || argv.length > 6) {
    showHelp();
    process.exit(1);
}

if (argv.includes('-h')) {
    showHelp();
    process.exit(0);
}

const options = {
    '-A': 'albums',
    '-a': 'artists',
    '-t': 'tracks'
};

const periods = {
    '-7': 'LAST_7_DAYS',
    '-30': 'LAST_30_DAYS',
    '-90': 'LAST_90_DAYS',
    '-180': 'LAST_180_DAYS',
    '-365': 'LAST_365_DAYS',
    '-all': 'ALL'
}

const periodText = {
    '-7': 'of the week',
    '-30': 'of the month',
    '-90': 'of the last 3 months',
    '-180': 'of the last 6 months',
    '-365': 'of the year',
    '-all': 'of all time'
}

if (argv[2][0] === '-') {
    console.log('No user specified. Try "flastfm -h" for more informations.');
    process.exit(1);
}

let user = argv[2];

let option;
let period;
let playcount;
let error;

for (let i = 3; i < argv.length; i++) {
    const arg = argv[i];

    if (arg[0] !== '-') {
        showHelp();
        process.exit(1);
    }

    const matchOption = (Object.keys(options)).find(item => item === arg);
    const matchPeriod = (Object.keys(periods)).find(item => item === arg);

    if (!matchOption && !matchPeriod && arg !== '-p') {
        console.log(`Invalid option -- "${arg.substring(1)}"`);
        error = true;
        break;
    }

    if (!option && matchOption) {
        option = matchOption;
        continue;
    }

    if (!period && matchPeriod) {
        period = matchPeriod;
        continue;
    }

    if (!playcount && arg === '-p') {
        playcount = arg;
        continue;
    }

    if (option && matchOption) {
        console.log(`Invalid period -- "${arg.substring(1)}"`);
        error = true;
        break;
    }

    if (period && matchPeriod) {
        console.log(`Invalid option -- "${arg.substring(1)}"`);
        error = true;
        break;
    }

    if (playcount && arg === '-p') {
        console.log(`Invalid option -- "${arg.substring(1)}"`);
        error = true;
        break;
    }
}

if (error) {
    console.log('Try "flastfm -h" for more informations.');
    process.exit(1);
}

if (!option) {
    option = '-A';
}

if (!period) {
    period = '-7';
}

const info = options[option];

getEntries(user, info, periods[period], (entries) => {
    if(entries.length === 0) {
        console.log('Unable to fetch ' + info + ' for user ' + user);
        process.exit(1);
    }

    const count = entries.length;

    // TODO convert html entities in strings
    console.log('Top ' + count + ' ' + user + '\'s ' + info + ' ' + periodText[period]);
    for(let i = 0; i < count; i++) {
        const name = entries[i][0];
        const artist = entries[i][1] ? (' - ' + entries[i][1]) : '';

        const plays = playcount ? '(' + entries[i][2] + ') ' : '';

        console.log((i + 1) + '. ' + plays + name + artist);
    }
    console.log();
});