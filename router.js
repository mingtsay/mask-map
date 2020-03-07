const fetchMask = require('./mask');

const Distance = require('geo-distance');
const Router = require('koa-router');
const router = new Router();

module.exports = {
    routes: () => router.routes(),
    allowedMethods: () => router.allowedMethods()
};

router.get('/', async ctx => {
    ctx.status = 302;
    ctx.redirect('/index.html');
});

router.get('/raw.json', async ctx => {
    ctx.body = await fetchMask();
});

router.get('/tgos', async ctx => {
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

router.get('/list/:longitude/:latitude', async ctx => {
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

router.get('/tgos/:county/:town?/:cunli?', async ctx => {
    const county = ctx.params.county || false;
    const town = ctx.params.town || false;
    const cunli = ctx.params.cunli || false;

    const mask = await fetchMask();
    const offset = parseInt(ctx.query.offset, 10) || 0;
    const limit = parseInt(ctx.query.limit, 10) || 50;
    const filter = !!ctx.query.filter;

    ctx.body = {
        type: 'FeatureCollection',
        features: mask.features
            .filter(el => !(
                county && county !== '不限制' && county !== el.properties.county ||
                town && town !== '不限制' && town !== el.properties.town ||
                cunli && cunli !== '不限制' && cunli !== el.properties.cunli ||
                filter && el.properties.mask_adult <= 0
            ))
            .slice(offset, limit < 0 ? -1 : offset + limit)
    };
});
