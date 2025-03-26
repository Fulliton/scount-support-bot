#!/usr/bin/env node

require('@babel/register')({
    extensions: ['.js'],
    ignore: [/node_modules/],
});

// динамический импорт cli.js (ESM)
(async () => {
    const module = await import('./cli.js');
    module.default(); // или module.runCLI()
})();