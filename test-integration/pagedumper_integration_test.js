'use strict';

const tmp = require('tmp');
const fs = require('fs');
const webdriverio = require('webdriverio');
const PageDumper = require('../lib/page_dumper');
const expect = require('chai').expect;

const WEBDRIVER_HOST = process.env.WEBDRIVER_HOST;
const WEBDRIVER_PORT = process.env.WEBDRIVER_PORT || 4444;

describe('PageDumper', () => {
  const wd = webdriverio.remote({ host: WEBDRIVER_HOST, port: WEBDRIVER_PORT });
  beforeEach(() => {
    return wd.init().url('http://www.google.com');
  });
  afterEach(() => {
    return wd.end();
  });

  describe('#getPageData', () => {
    it('should return page data as a JSON object', () => {
      const pd = new PageDumper();
      return pd.getPageData(wd).then(res => {
        expect(res.title).to.match(/Google/);
        expect(res.url).to.match(/google/);
        expect(res.elements.length).to.be.gt(0);
        expect(res.elements[0]).to.have.all.keys(
          ['id', 'display', 'tag', 'parentId', 'size', 'location', 'html']);
      });
    });
  });

  describe('#dumpPage', () => {
    it('should save a screenshot and page data in a directory', () => {
      const tmpDir = tmp.dirSync().name;
      const pd = new PageDumper();
      return pd.dumpPage(wd, tmpDir).then((res) => {
        const screenshotStats = fs.statSync(res.screenshotFile);
        const dataStats = fs.statSync(res.dataFile);
        expect(screenshotStats.isFile()).to.be.true;
        expect(dataStats.isFile()).to.be.true;
        expect(screenshotStats.size).to.be.gt(0);
        expect(dataStats.size).to.be.gt(0);
      });
    });
  });
});
