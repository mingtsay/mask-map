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

router.get('/tgos', async (ctx, next) => {
    const mask = await fetchMask();

    const Tgos = new Map();

    for (const record of mask.features) {
        const county = record.properties.county;
        const town = record.properties.town;
        const cunli = record.properties.cunli;

        if (!county.length) continue;
        if (!town.length) continue;
        if (!cunli.length) continue;

        if (!Tgos.has(county)) Tgos.set(county, new Map());
        const County = Tgos.get(county);

        if (!County.has(town)) County.set(town, new Set());
        const Town = County.get(town);

        Town.add(cunli);
    }

    const tgos = Object.fromEntries(Tgos);

    Object.keys(tgos).map(county => {
        tgos[county] = Object.fromEntries(tgos[county]);
        Object.keys(tgos[county]).map(town => {
            tgos[county][town] = Array.from(tgos[county][town])
        })
    });

    ctx.body = tgos;
});

router.get('/list/:longitude/:latitude', async (ctx, next) => {
    const userLocation = {lon: ctx.params.longitude, lat: ctx.params.latitude};

    const mask = await fetchMask();

    const offset = parseInt(ctx.query.offset, 10) || 0;
    const limit = parseInt(ctx.query.limit, 10) || 50;
    const filter = !!ctx.query.filter;

    ctx.body = {
        type: 'FeatureCollection',
        features: mask.features
            .filter(el => !(filter && el.properties.mask_adult <= 0))
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

router.get('/tgos/:county/:town?/:cunli?', async (ctx, next) => {
    const county = ctx.params.county || false;
    const town = ctx.params.town || false;
    const cunli = ctx.params.cunli || false;

    console.log(county, town, cunli);

    const mask = await fetchMask();
    const offset = parseInt(ctx.query.offset, 10) || 0;
    const limit = parseInt(ctx.query.limit, 10) || 50;
    const filter = !!ctx.query.filter;

    ctx.body = {
        type: 'FeatureCollection',
        features: mask.features
            .filter(el => !(
                county && county !== el.properties.county ||
                town && town !== el.properties.town ||
                cunli && cunli !== el.properties.cunli ||
                filter && el.properties.mask_adult <= 0
            ))
            .slice(offset, limit < 0 ? -1 : offset + limit)
    };
});
