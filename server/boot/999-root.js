module.exports = function bootScriptRoot(server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  router.get('/ping', server.loopback.status());
  server.use(router);
};
