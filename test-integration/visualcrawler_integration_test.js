'use strict';

const tmp = require('tmp');
const fs = require('fs');
const path = require('path');
const webdriverio = require('webdriverio');
const VisualCrawler = require('../lib/visualcrawler');
const expect = require('chai').expect;

const WEBDRIVER_HOST = process.env.WEBDRIVER_HOST;
const WEBDRIVER_PORT = process.env.WEBDRIVER_PORT || 4444;

describe('VisualCrawler', () => {
  const wd = webdriverio.remote({ host: WEBDRIVER_HOST, port: WEBDRIVER_PORT });
  beforeEach(() => {
    return wd.init().url('http://www.google.com');
  });
  afterEach(() => {
    return wd.end();
  });

  describe('#getPageData', () => {
    it('should return page data as a JSON object', () => {
      const vc = new VisualCrawler(wd);
      return vc.getPageData(wd).then(res => {
        expect(res.title).to.match(/Google/);
        expect(res.url).to.match(/google/);
        expect(res.elements.length).to.be.gt(0);
        expect(res.elements[0]).to.have.all.keys(['id', 'parentId', 'size', 'location', 'html']);
      });
    });
  });

  describe('#crawlPage', () => {
    it('should save a screenshot and page data in a directory', () => {
      const tmpDir = tmp.dirSync().name;
      const vc = new VisualCrawler(wd);
      return vc.crawlPage(wd, tmpDir).then(() => {
        const screenshotStats = fs.statSync(path.join(tmpDir, 'screenshot.png'));
        const dataStats = fs.statSync(path.join(tmpDir, 'data.json'));
        expect(screenshotStats.isFile()).to.be.true;
        expect(dataStats.isFile()).to.be.true;
        expect(screenshotStats.isFile()).to.be.gt(0);
        expect(dataStats.size).to.be.gt(0);
      });
    });
  });
});