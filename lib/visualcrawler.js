'use strict';

const Promise = require('bluebird');
const ActionCrawler = require('./actioncrawler');

class VisualCrawler {
  constructor(wdClient) {
    this.wd = wdClient;
    this.ac = new ActionCrawler(wdClient);
  }

  captureElements(client) {
    // TODO: Captures all elements with rendered location boundaries
  }
}

module.exports = VisualCrawler;
