const fetch = require('node-fetch-commonjs');
const fs = require('fs');

const log = require('./log');

/* Fecthes quotes and saves into file. */ {
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
            const { _id: id, content, author, tags, authorSlug, dateAdded } = response || {};
            return {
                id,
                content,
                author,
                tags,
                authorSlug,
                dateAdded,
            };
        });

        const metadata = (id) => `{\"create\":{\"_id\":\"${id}\"}}`;
        const source = (quote = {}) => JSON.stringify({
            ...quote,
            id: undefined, // this field is omitted
        });

        const bulk = quotes.reduce((acc, quote) => {
            return acc.concat(`${metadata(quote.id)}\n${source(quote)}\n`);
        }, '') /* as NDJSON */;

        fs.writeFileSync(file, bulk);
        log(`\r${total} quote${total > 1 ? 's' : ''} saved into ${file} successfully.\n`);
    });
}