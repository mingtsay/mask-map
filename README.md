# Mask Map

Displaying the mask information from https://github.com/kiang/pharmacies/

## Usage

Using the `.env` file:

```
cp .env.example .env
npm install
node index.js
```

Using the environment variables:

```
npm install
MASK_DATA_URI=https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json \
LISTEN_PORT=8886 \
node index.js
```

## Note

Currently I use this website to minify my JS and CSS files:

https://www.minifier.org/
