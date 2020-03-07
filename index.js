require('dotenv').config();

const router = require('./router');
const sgr = {
  bold: '\033[1m',
  reset: '\033[0m',
};
const serv = (new (require('koa')))
    .use(require('koa-logger')())
    .use(require('koa-response-time')())
    .use(require('koa-conditional-get')())
    .use(require('koa-etag')())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(process.env.LISTEN_PORT);

console.log(`${sgr.bold}INFO:${sgr.reset} We are listening on port ${serv.address().port}.`);