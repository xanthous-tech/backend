const debug = require('debug')('server-main:index');
const loopback = require('loopback');
const boot = require('loopback-boot');

const app = loopback();

// start the web server
app.start = () => app.listen(() => {
  app.emit('started');
  const baseUrl = app.get('url').replace(/\/$/, '');
  debug('Web server listening at: %s', baseUrl);
  if (app.get('loopback-component-explorer')) {
    const explorerPath = app.get('loopback-component-explorer').mountPath;
    debug('Browse your REST API at %s%s', baseUrl, explorerPath);
  }
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, (err) => {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) app.start();
});

module.exports = app;
