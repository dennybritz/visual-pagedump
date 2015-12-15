const _ = require('lodash');
const Promise = require('bluebird');
const expect = require('chai').expect;
const ActionCrawler = require('../lib/actioncrawler');

describe('ActionCrawler', () => {
  describe('#registerAction', () => {
    it('should add the actions to the internal actions set', () => {
      const ac = new ActionCrawler();
      ac.registerAction('visit', _.noop);
      expect(ac.actions.has('visit')).to.eql(true);
      expect(ac.actions.get('visit')).to.eql(_.noop);
    });
  });

  describe('#enqueue', () => {
    it('should add an existing action to the end of the queue', () => {
      const ac = new ActionCrawler();
      ac.registerAction('test', _.noop);
      ac.enqueue('test', ['arg1', 2]);
      expect(ac.state.queue.length).to.eql(1);
      expect(ac.state.queue[0][0]).to.eql('test');
      expect(ac.state.queue[0][1]).to.eql(['arg1', 2]);
    });

    it('should throw an error for a non-existing action', () => {
      const ac = new ActionCrawler();
      expect(ac.enqueue.bind(ac, 'test', ['arg1', 2])).to.throw(/Action not found/);
    });
  });

  describe('#toJSON', () => {
    it('should return a JSON representation of the internal state', () => {
      const ac = new ActionCrawler();
      ac.registerAction('test', _.noop);
      ac.enqueue('test', ['arg1', 2]);
      expect(ac.toJSON()).to.not.be.empty;
    });
  });

  describe('#fromJSON', () => {
    it('should correctly deserialize the state', () => {
      const ac1 = new ActionCrawler();
      ac1.registerAction('test', _.noop);
      ac1.enqueue('test', ['arg1', 2]);
      const stateStr = ac1.toJSON();
      const ac2 = new ActionCrawler();
      ac2.registerAction('test', _.noop);
      ac2.fromJSON(stateStr);
      expect(ac1.state).to.eql(ac2.state);
    });
  });

  describe('#run', () => {
    it('should work with a single action', () => {
      const mockClient = { test: () => Promise.resolve('Success!') };
      const ac = new ActionCrawler(mockClient);
      ac.registerAction('test', client => client.test());
      ac.enqueue('test');
      return ac.runAsync().then(res => {
        expect(res.pop()).to.match(/Success!/);
      });
    });

    it('should work with multiple actions', () => {
      const mockClient = {
        test1: () => Promise.resolve('Success1!'),
        test2: () => Promise.resolve('Success2!'),
      };
      const ac = new ActionCrawler(mockClient);
      ac.registerAction('test1', client => client.test1());
      ac.registerAction('test2', client => client.test2());
      ac.enqueue('test1');
      ac.enqueue('test2');
      return ac.runAsync().then(res => {
        expect(res.pop()).to.match(/Success2!/);
        expect(res.pop()).to.match(/Success1!/);
      });
    });

    it('should work with actions that enqueue more actions', () => {
      const mockClient = {
        test1: () => Promise.resolve('Success1!'),
        test2: () => Promise.resolve('Success2!'),
      };
      const ac = new ActionCrawler(mockClient);
      ac.registerAction('test2', client => client.test2());
      ac.registerAction('test1', client => {
        ac.enqueue('test2');
        return client.test1();
      });
      ac.enqueue('test1');
      return ac.runAsync().then(res => {
        expect(res.pop()).to.match(/Success2!/);
        expect(res.pop()).to.match(/Success1!/);
      });
    });
  });
});

