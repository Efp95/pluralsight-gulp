
var gulp = require('gulp');
var del = require('del');
var args = require('yargs').argv;
var config = require('./gulp.config')();

var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('vet', function () {
    log('Analyzing code with JSHint and JSCS');

    return gulp.src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

// =================

gulp.task('styles', ['clean-styles'], function() {
    log('Compiling LESS --> CSS');

    return gulp.src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        .pipe(gulp.dest(config.temp));
});

// =================

gulp.task('clean-styles', function() {
    var files = config.temp + '**/*.css';
    clean(files);
});

// =================

gulp.task('less-watcher', function() {
    gulp.watch([config.less], ['styles']);
});

///////////////////

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    }
    else {
        $.util.log($.util.colors.blue(msg));
    }
}

function clean(path) {
    log('Cleaning ' + path);
    del(path);
}
