const path = require('path');
const fs = require('fs');

const asciidoctor = require('@asciidoctor/core')();
const revealjs = require('@asciidoctor/reveal.js');

const log = require('./log');

/* Uses Reveal.js API to convert Asciidoc file to HTML */ {
    const adocFile = process.argv[2] || '';
    const distDir = process.argv[3] || 'dist';
    if (!!adocFile) {
        revealjs.register();
        const options = {
            safe: 'safe',
            backend: 'revealjs',
        };
        asciidoctor.convertFile(adocFile, options);
        const dirname = process.cwd();
        const toFile = adocFile.replace(/\.(adoc|asciidoc)$/g, '.html');
        const distPath = path.join(dirname, distDir, toFile);
        fs.rename(
            path.join(dirname, toFile),
            distPath,
            (err) => {
                const message = !!err
                    ? err.message
                    : `Exported to ${distPath} successfully.`;
                log(`${message}\n`, !!err);
            },
        );
    }
}