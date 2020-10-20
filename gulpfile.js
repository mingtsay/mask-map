const { dest, parallel, series, src, task } = require('gulp')
const terser = require('gulp-terser')
const cleanCss = require('gulp-clean-css')
const htmlMin = require('gulp-htmlmin')
const del = require('del')

const addTask = ({ name = '', description = '', fn }) => {
    if (name) fn.displayName = name
    if (description) fn.description = description
    task(fn)
}

addTask({
    name: 'clean',
    description: 'Clean output files',
    fn: cb => del('static')
        .then(() => cb()),
})

addTask({
    name: 'js',
    description: 'Terser JavaScript files',
    fn: cb => src('src/js/**/*.js')
        .pipe(terser())
        .pipe(dest('static/js'))
        .on('end', cb),
})

addTask({
    name: 'css',
    description: 'Clean CSS files',
    fn: cb => src('src/css/**/*.css')
        .pipe(cleanCss())
        .pipe(dest('static/css'))
        .on('end', cb),
})

addTask({
    name: 'html',
    description: 'Minify HTML files',
    fn: cb => src('src/**/*.html')
        .pipe(htmlMin({
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            decodeEntities: true,
            quoteCharacter: '\'',
            removeAttributeQuotes: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeStyleLinkTypeAttributes: true,
        }))
        .pipe(dest('static'))
        .on('end', cb),
})

addTask({
    name: 'default',
    description: 'Rebuild all files',
    fn: series('clean', parallel('js', 'css', 'html')),
})
