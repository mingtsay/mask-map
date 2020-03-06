const fetch = require('node-fetch');

const fetchMaskIfNoneMatch = etag =>
    fetch(process.env.MASK_DATA_URI, {headers: {'If-None-Match': etag}});

let mask = {
    etag: '',
    json: {}
};

const fetchMask = async () => {
    await fetchMaskIfNoneMatch(mask.etag)
        .then(async r => {
            if (200 === r.status) {
                mask.etag = r.headers.get('etag');
                mask.json = await r.json();
            }
        });
    return mask.json;
};

module.exports = exports = () => fetchMask();
