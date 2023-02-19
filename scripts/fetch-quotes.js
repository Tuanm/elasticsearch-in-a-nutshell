const fetch = require('node-fetch-commonjs');
const fs = require('fs');

const log = require('./log');

/* Fecthes quotes and saves into file. */ {
    const action = '{\"create\":{}}\n'; // used for Elasticsearch's bulking
    const url = 'https://api.quotable.io/random';
    const file = 'http/data/quotes.ndjson';
    const total = Number(process.argv[2]) || 0;
    const requests = [];

    if (total <= 0) {
        log(`Please provide a valid number to fetch at least 1 quote.`);
        process.exit(1);
    }

    for (let count = 1; count <= total; count++) {
        const request = fetch(url).then((res) => {
            log(`\rFetching ${count}/${total}...`);
            return res.json();
        }) /* as Promise */;
        requests.push(request);
    }

    Promise.all(requests).then((responses) => {
        const quotes = responses.map((response) => {
            const { content, author, tags, authorSlug, dateAdded } = response || {};
            return JSON.stringify({
                content,
                author,
                tags,
                authorSlug,
                dateAdded,
            });
        });
        const bulk = action + quotes.join(`\n${action}`) + '\n' /* as NDJSON */;
        fs.writeFileSync(file, bulk);
        log(`\r${total} quote${total > 1 ? 's' : ''} saved into ${file} successfully.\n`);
    });
}