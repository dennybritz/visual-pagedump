'use strict';

const expect = require('chai').expect;
const PageDumper = require('../lib/page_dumper');

describe('PageDumper', () => {
  describe('#getPageData', () => {
    it('return a page data object from the client', () => {
      const mockClient = {
        getTitle: () => 'Title',
        getUrl: () => 'url',
        execute: () => { return { value: [1, 2, 3] }; },
      };
      const pd = new PageDumper();
      return pd.getPageData(mockClient).then(result => {
        expect(result).to.eql({ title: 'Title', url: 'url', elements: [1, 2, 3] });
      });
    });
  });
  describe('#dumpPage', () => {
    it('should work');
  });
});
