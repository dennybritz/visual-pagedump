const expect = require('chai').expect;
const ActionCrawler = require('../lib/actioncrawler');

const WEBDRIVER_HOST = process.env.WEBDRIVER_HOST;

describe('ActionCrawler', () => {
  describe('#registerAction', () => {
    it('should work');
  });

  describe('#enqueue', () => {
    it('should work');
  });

  describe('#toJSON', () => {
    it('should work');
  });

  describe('#fromJSON', () => {
    it('should work');
  });

  describe('#run', () => {
    it('should work with a single action', () => {
      const ac = new ActionCrawler({ webdriver: { host: WEBDRIVER_HOST, port: 4444 } });
      ac.registerAction('test', client => client.url('http://www.cnn.com').getTitle());
      ac.enqueue('test');
      return ac.runAsync().then(res => {
        expect(res.pop()).to.match(/CNN/);
      });
    });

    it('should work with multiple actions', () => {
      const ac = new ActionCrawler({ webdriver: { host: WEBDRIVER_HOST, port: 4444 } });
      ac.registerAction('visit', client => client.url('http://www.cnn.com'));
      ac.registerAction('getTitle', client => client.getTitle());
      ac.enqueue('visit');
      ac.enqueue('getTitle');
      return ac.runAsync().then(res => {
        expect(res.pop()).to.match(/CNN/);
      });
    });

    it('should work with actions that enqueue more actions', () => {
      const ac = new ActionCrawler({ webdriver: { host: WEBDRIVER_HOST, port: 4444 } });
      ac.registerAction('test', client => {
        ac.enqueue('getTitle');
        return client.url('http://www.cnn.com');
      });
      ac.registerAction('getTitle', client => client.getTitle());
      ac.enqueue('test');
      return ac.runAsync().then(res => {
        expect(res.pop()).to.match(/CNN/);
      });
    });
  });
});

