# Mask Map

Displaying the mask information from <https://github.com/kiang/pharmacies/>

## Usage

Using the `.env` file:

```bash
cp .env.example .env
npm install
npm run start
```

Using the environment variables:

```bash
npm install
MASK_DATA_URI=https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json \
LISTEN_PORT=8886 \
npm run start
```

If you want to see the verbose messages, just set the `VERBOSE` envrionment variable as `1`. For example:

```bash
VERBOSE=1 npm run start
```

## Note

Currently I use this website to minify my JS and CSS files:

<https://www.minifier.org/>
