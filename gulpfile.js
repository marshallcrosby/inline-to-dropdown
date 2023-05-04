/// <binding ProjectOpened='build' />
'use strict';

const gulp = require('gulp');

// CSS-related
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');

// JS-related
const minify = require('gulp-minify');
const include = require('gulp-include');

// Utility-related
const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');
const open = require('gulp-open');

const localhost = 'http://localhost:8080/';

const roots = {
    src: './src',
    dist: './dist',
};

const pluginName = 'inline-to-dropdown';

// Move html to dist
gulp.task('html', () => {
    return gulp.src([`${roots.src}/index.html`])
        .pipe(gulp.dest(`${roots.dist}`))
        .pipe(connect.reload());
});

// Bundle javascript
gulp.task('js', () => {            
    return gulp.src([`${roots.src}/js/${pluginName}.js`], { sourcemaps: true })
        .pipe(include())       
        .pipe(minify({
            ext: {
                min: ".min.js",
            },
                preserveComments: 'some'
            }
        ))
        .pipe(gulp.dest(`${roots.dist}/js`, { sourcemaps: '.' }))
        .pipe(connect.reload());
});

// Creates Main CSS sourcemaps, converts SCSS to CSS, adds prefixes, and lints CSS
gulp.task('sass', () => {
    const plugins = [
        autoprefixer({ grid: true })
    ];

    return gulp.src([`${roots.src}/scss/${pluginName}.scss`])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${roots.dist}/css`))
        .pipe(rename(`${pluginName}.min.css`))
        .pipe(cleanCss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${roots.dist}/css`))
        .pipe(connect.reload());
});

// Runs a server to static HTML files and sets up watch tasks
gulp.task('server', (done) => {
    gulp.watch((`${roots.src}/**/*.html`), gulp.series('html'));
    gulp.watch((`${roots.src}/scss/**/*.scss`), gulp.series('sass', 'js'));
    gulp.watch((`${roots.src}/js/**/*`), gulp.series('sass', 'js'));

    connect.server({
        root: roots.dist,
        livereload: true
    });

    setTimeout(() => {
        return gulp.src(__filename)
            .pipe(open({ uri: localhost }));
    }, 2000);

    done();
});

gulp.task('watch', (done) => {
    gulp.watch((`${roots.src}/**/*.html`), gulp.series('html'));
    gulp.watch((`${roots.src}/scss/**/*.scss`), gulp.series('sass', 'js'));
    gulp.watch((`${roots.src}/js/**/*`), gulp.series('sass', 'js'));

    done();
});

gulp.task('build', gulp.series('sass', 'html', 'js'));

gulp.task('default', gulp.series('build', 'server'));
