'use strict';

const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const log = require('bunyan').createLogger({ name: 'PageDumper' });
const dumpDOMElements = require('./dump_dom_elements');

class PageDumper {
  dumpPage(client, outputDirectory) {
    const screenshotFile = path.resolve(path.join(outputDirectory, 'screenshot.png'));
    const dataFile = path.resolve(path.join(outputDirectory, 'data.json'));
    return Promise.resolve(client.saveScreenshot(screenshotFile))
      .then(() => this.getPageData(client))
      .then(pageData => {
        fs.writeFileSync(dataFile, JSON.stringify(pageData));
        log.info({ screenshotFile, dataFile }, 'dumped page');
        return { screenshotFile, dataFile };
      });
  }

  getPageData(client) {
    return Promise.all([
      client.getUrl(),
      client.getTitle(),
      Promise.resolve(client.execute(dumpDOMElements)).get('value'),
    ]).spread((url, title, elements) => {
      return { url, title, elements };
    });
  }
}

module.exports = PageDumper;
