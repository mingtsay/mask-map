require('dotenv').config();

const sgr = {
    bold: '\033[1m',
    reset: '\033[0m',
};

const router = require('./router');
const app = (new (require('koa')))
    .use(require('koa-logger')())
    .use(require('koa-response-time')())
    .use(require('koa-conditional-get')())
    .use(require('koa-etag')())
    .use(require('koa-static')('./static'))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(process.env.LISTEN_PORT, process.env.LISTEN_HOST, () => {
        const {address, port, family} = app.address();
        const hostname = family === 'IPv6' ? `[${address}]` : address;
        const protocol = app.addContext ? 'https' : 'http';
        if (process.env.VERBOSE)
            console.log(`${sgr.bold}INFO:${sgr.reset} Listening on ${protocol}://${hostname}:${port}…`);
    });
