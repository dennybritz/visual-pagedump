'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const webdriverio = require('webdriverio');
const express = require('express');
const bodyParser = require('body-parser');
const tmp = require('tmp');
const PageDumper = require('../lib/page_dumper');
const log = require('bunyan').createLogger({ name: 'api' });

const app = express();
app.use(bodyParser.json());

const WEBDRIVER_HOST = process.env.WEBDRIVER_PORT_4444_TCP_ADDR || 'webdriver';
const WEBDRIVER_PORT = process.env.WEBDRIVER_PORT_4444_TCP_PORT || 4444;

log.info(`Using Selenium server at ${WEBDRIVER_HOST}:${WEBDRIVER_PORT}`);

app.post('/api/v1/dumpPage', (req, res) => {
  const wd = webdriverio.remote({ host: WEBDRIVER_HOST, port: WEBDRIVER_PORT });
  const pd = new PageDumper();
  const options = _.defaults(req.body.options, {});
  Promise.try(() => wd.init().windowHandleMaximize('current').url(req.body.url))
  .then(() => {
    const outputDir = tmp.dirSync({ prefix: options.outputDir }).name;
    return pd.dumpPage(wd, outputDir);
  })
  .then((dumpResult) => res.send(dumpResult))
  .finally(() => wd.end())
  .catch(err => {
    log.error(err);
    res.sendStatus(500);
  });
});

module.exports = app;
