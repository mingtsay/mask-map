const { 
  series, parallel, src, dest
} = require('gulp');
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const del = require('del');

exports.clean = function clean() {
  return del('static');
}
exports.js = function js() {
  return src('src/js/*.js')
    .pipe(terser())
    .pipe(dest('static/js'));
};
exports.css = function css() {
  return src('src/css/*.css')
    .pipe(cleanCSS())
    .pipe(dest('static/css'));
};
exports.html = function html() {
  return src('src/index.html')
    .pipe(htmlmin({
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      decodeEntities: true,
      quoteCharacter: "'",
      removeAttributeQuotes: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeStyleLinkTypeAttributes: true,
    }))
    .pipe(dest('static'));
}
exports.default = series(exports.clean, parallel(exports.js, exports.css, exports.html));