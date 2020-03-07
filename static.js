module.exports = async (ctx, next) => {
    const static_files = [
        '/index.html',
        '/css/pure-min.css',
        '/css/grids-responsive-min.css',
        '/js/app.js'
    ];

    if (static_files.indexOf(ctx.path) > -1) {
        return await require('koa-send')(ctx, `static/${ctx.path}`);
    }

    await next();
};
