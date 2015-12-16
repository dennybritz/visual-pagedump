'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const Promise = require('bluebird');
const ActionCrawler = require('./actioncrawler');
const log = require('bunyan').createLogger({ name: 'VisualCrawler '})

const ELEMENT_FETCH_CONCURRENCY = 32;

class VisualCrawler {
  constructor(wdClient) {
    this.wd = wdClient;
    this.ac = new ActionCrawler(wdClient);
  }

  crawlPage(client, outputDirectory) {
    const screenShotFile = path.resolve(path.join(outputDirectory, 'screenshot.png'));
    const dataFile = path.resolve(path.join(outputDirectory, 'data.json'));
    return Promise.resolve(client.saveScreenshot(screenShotFile))
      .then(() => this.getPageData(client))
      .tap(pageData => {
        fs.writeFileSync(dataFile, JSON.stringify(pageData));
        log.info({ screenShotFile, dataFile }, 'crawled page');
      });
  }

  getPageData(client) {
    return Promise.resolve(client.elements('*')).get('value').map(jsonWebElement => {
      const elementID = jsonWebElement.ELEMENT;
      return Promise.all([
        elementID,
        Promise.resolve(client.elementIdElement(elementID, '..')).get('value').get('ELEMENT').catch(() => null),
        Promise.resolve(client.elementIdSize(elementID)).get('value'),
        Promise.resolve(client.elementIdLocation(elementID)).get('value'),
        Promise.resolve(client.elementIdAttribute(elementID, 'outerHTML')).get('value'),
      ]);
    }, { concurrency: ELEMENT_FETCH_CONCURRENCY }).then(results => {
      const elements = _.map(results, props => _.zipObject(['id', 'parentId', 'size', 'location', 'html'], props));
      return [client.getUrl(), client.getTitle(), elements];
    }).spread((url, title, elements) => {
      return { url, title, elements };
    });
  }
}

module.exports = VisualCrawler;
