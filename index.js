require('dotenv').config();

const router = require('./router');

(new (require('koa')))
    .use(require('koa-logger')())
    .use(require('koa-response-time')())
    .use(require('koa-conditional-get')())
    .use(require('koa-etag')())
    .use(require('koa-static')('./static'))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(process.env.LISTEN_PORT);
