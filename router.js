const fetchMask = require('./mask');

const Distance = require('geo-distance');
const Router = require('koa-router');
const router = new Router();

module.exports = {
    routes: () => router.routes(),
    allowedMethods: () => router.allowedMethods()
};

router.get('/', async (ctx, next) => {
    await require('koa-send')(ctx, 'static/index.html');
});

router.get('/css/pure-min.css', async (ctx, next) => {
    await require('koa-send')(ctx, 'static/pure-min.css');
});

router.get('/raw.json', async (ctx, next) => {
    ctx.body = await fetchMask();
});

router.get('/list/:longitude/:latitude', async (ctx, next) => {
    const userLocation = {lon: ctx.params.longitude, lat: ctx.params.latitude};
    const mask = await fetchMask();
    const offset = parseInt(ctx.query.offset, 10) || 0;
    const limit = parseInt(ctx.query.limit, 10) || 50;
    const filter = ctx.query.filter ? true : false;
    ctx.body = {
        type: 'FeatureCollection',
        features: mask.features
            .filter(el => el.properties.mask_adult > 0)
            .map(el => {
                el.properties.distance = Distance.between(userLocation, {
                    lon: el.geometry.coordinates[0],
                    lat: el.geometry.coordinates[1]
                }).human_readable();
                return el;
            })
            .sort((x, y) => {
                return x.properties.distance.distance_earth_radians - y.properties.distance.distance_earth_radians;
            }).slice(offset, limit < 0 ? -1 : offset + limit)
    };
});
