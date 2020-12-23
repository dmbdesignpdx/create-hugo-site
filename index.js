#!/usr/bin/env node

'use strict';

const fs = require('fs');

const { _, _i, _d } = require('./helpers');
const pkg = require('./package.json');
const rootFiles = require('./lib/root');
const staticFiles = require('./lib/static');
const assetsFiles = require('./lib/assets');

const build = dir => {
  const fixed = './' + dir;
  process.stdout.write(
    `\nCREATE \x1b[41m\x1b[30m H \x1b[0m \x1b[44m\x1b[30m U \x1b[0m \x1b[42m\x1b[30m G \x1b[0m \x1b[43m\x1b[30m O \x1b[0m SITE`
  );
  process.stdout.write(`\n\n${_i} Building directories and writing files...`);
  fs.mkdir(fixed, _(() => {
    Promise.all([
      Promise.resolve(rootFiles(fixed)),
      Promise.resolve(staticFiles(fixed)),
      Promise.resolve(assetsFiles(fixed)),
    ]).then(() => {
      process.stdout.write(`\n\n${_d} \x1b[1mcd\x1b[0m into /${dir} to start!`);
      process.stdout.write(`\n\n`);
    });
  }));
};

switch(true) {
  case process.argv.includes('-v'): {
    process.stdout.write(`\nCreate Hugo Site version: ${pkg.version}`);
    process.stdout.write(`\n\n`);
    break;
  }
  case process.argv.includes('-h'): {
    process.stdout.write(`\nCreate Hugo Site help:`);
    process.stdout.write(`\n\ncreate-hugo-site [ <dir> | <flags> ]`);
    process.stdout.write(`\n\n  <dir>  build directory`);
    process.stdout.write(`\n     -v  get current version`);
    process.stdout.write(`\n     -h  show this message`);
    process.stdout.write(`\n\n`);
    break;
  }
  default: {
    build(process.argv[2]);
  }
}
