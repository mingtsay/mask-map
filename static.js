module.exports = async (ctx, next) => {
    const static_files = {
        '/': 'index.html',
        '/css/pure-min.css': 'pure-min.css',
        '/css/grids-responsive-min.css': 'grids-responsive-min.css',
    };

    if (static_files[ctx.path]) {
        const filename = static_files[ctx.path];
        return await require('koa-send')(ctx, `static/${filename}`);
    }

    await next();
};
