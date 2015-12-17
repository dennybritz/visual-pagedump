'use strict';

const app = require('./app');
const log = require('bunyan').createLogger({ name: 'server' });

const server = app.listen(process.env.PORT || 80, () => {
  const host = server.address().address;
  const port = server.address().port;
  log.info({ host, port }, `App listening at http://${host}:${port}`);
});