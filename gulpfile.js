const gulp = require('gulp');
const minify = require('gulp-clean-css');
const zip = require('gulp-zip');
const moment = require('moment-mini');
const builder = require('electron-builder');
const Platform = builder.Platform;

const paths = {
    styles : {
        src : 'src/css/*.css',
        dest : 'build/css'
    },
    static : {
        src : 'src/static/**/*.*',
        dest : 'build/static'
    }
}

const css = () => {
    return gulp
    .src(paths.styles.src)
    .pipe(minify(paths.styles.src))
    .pipe(gulp.dest(paths.styles.dest));
}

const static = () => {
    return gulp
    .src(paths.static.src)
    .pipe(gulp.dest(paths.static.dest));
}

const watch = () => {
    gulp.watch(paths.styles.src, css);
    gulp.watch(paths.static.src,static);
}

const snap = () => {
    let timestamp = moment().format('DD-MMM-hhmmss');
    return gulp
    .src([
        'src/**/*',
        '.gitignore',
        'gulpfile.js',
        'main.js',
        'package.json',
        'webpack.config.js',
        'README.md'
    ], {base : '.'})
    .pipe(zip('restocks-snap-' + timestamp + '.zip'))
    .pipe(gulp.dest('dist'));
}

const releaseWin = (done) => {
    builder.build({
        targets : Platform.WINDOWS.createTarget(),
        config : {
            files  : [
                'build/**/*',
                'main.js'
            ],
            extraResources : [
                'build/static/assets/*.png'
            ],
            directories : {
                output : 'dist/win'
            },
            icon : 'build/static/assets/icon.ico'
        }
    }).then(res => {
        done();
    }).catch(e => {
        console.log(e);
        done();
    })
}

const releaseMac = (done) => {
    builder.build({
        targets : Platform.MAC.createTarget(),
        config : {
            files  : [
                'build/**/*',
                'main.js'
            ],
            extraResources : [
                'build/static/assets/*.png'
            ],
            directories : {
                output : 'dist/win'
            },
            icon : 'build/static/assets/icon.ico'
        }
    }).then(res => {
        done();
    }).catch(e => {
        console.log(e);
        done();
    })
}

exports.css = css;
exports.static = static;
exports.snap = snap;
exports.releaseWin = releaseWin;
exports.releaseMac = releaseMac;
exports.default = watch;