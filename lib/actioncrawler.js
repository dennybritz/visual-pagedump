'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class ActionCrawler {
  constructor(client) {
    this.client = client;
    this.state = {
      queue: [],
    };
    this.actions = new Map();
  }

  registerAction(name, func) {
    this.actions.set(name, func);
    return this;
  }

  enqueue(actionName, args) {
    if (!this.actions.has(actionName)) {
      throw new Error(`Action not found: ${actionName}. Did you forget to register it?`);
    }
    this.state.queue.unshift([actionName, args]);
    return this;
  }

  toJSON() {
    return JSON.stringify(this.state);
  }

  fromJSON(str) {
    this.state = JSON.parse(str);
    return this;
  }

  run(callback) {
    this._run([], callback);
  }

  _run(results, callback) {
    if (this.state.queue.length === 0) {
      return callback(null, results);
    }
    this.nextAsync().then(res => {
      const newResult = _.union(results || [], [res]);
      return Promise.fromCallback(cb => this._run(newResult, cb));
    }).nodeify(callback);
  }

  next(callback) {
    const [actionName, actionArgs] = this.state.queue.pop();
    const actionPromise = this.actions.get(actionName).apply(this, _.union([this.client], actionArgs));
    Promise.resolve(actionPromise).nodeify(callback);
  }
}

Promise.promisifyAll(ActionCrawler.prototype);
module.exports = ActionCrawler;
