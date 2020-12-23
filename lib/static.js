'use strict';

const fs = require('fs');
const fsp = fs.promises;

const { _, completed } = require('../helpers');

const favicon = `<?xml version="1.0" encoding="utf-8"?><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><style>\n<!-- STYLES -->\n</style></defs>\n<!-- ICON -->\n</svg>`;

const pinned = `<?xml version="1.0" encoding="utf-8"?><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">\n<!-- ICON -->\n</svg>`;

const writeFiles = async dir => {
  await fsp.writeFile(`${dir}/favicon.svg`, favicon);
  await fsp.writeFile(`${dir}/pinned-tab.svg`, pinned);
  
  completed('Static files');
}

const staticFiles = dir => {
  fs.mkdir(`${dir}/static`, _(() => {
    fs.mkdirSync(`${dir}/static/fonts`, _(() => {
      fs.writeFileSync(`${dir}/static/fonts/.gitkeep`, '');
    }));
    fs.mkdir(`${dir}/static/img`, _(() => writeFiles(`${dir}/static/img`)));
  }));
};

module.exports = staticFiles;
