var projectName = '<form>ario',
    projectSlug = 'formario';


/* MODULES */

        // gulp & base tools
    var gulp        = require('gulp'),
        plumber     = require('gulp-plumber'),
        livereload  = require('gulp-livereload'),
        cache       = require('gulp-cache'),
        sourcemaps  = require('gulp-sourcemaps'),
        rename      = require('gulp-rename'),
        notify      = require('gulp-notify'),
        notificationCenter = require('node-notifier').NotificationCenter,

        // html
        htmlmini    = require('gulp-html-minifier'),

        // css
        autoprefixer= require('gulp-autoprefixer'),
        sass        = require('gulp-ruby-sass'),

        // js
        concat      = require('gulp-concat'),
        uglify      = require('gulp-uglify'),

        // img
        imgmin     = require('gulp-imagemin');


/* PATHS */

    var root        = '';
        dev         = './dev/',
        htdocs      = './htdocs/',

        jsSrc       = dev       + 'js/',
        jsDest      = htdocs    + 'js/',

        cssSrc      = dev       + 'scss/',
        cssDest     = htdocs    + 'css/',

        imgSrc      = dev       + 'img/',
        imgDest     = htdocs    + 'img/',

        fontSrc     = dev       + 'font/',
        fontDest    = htdocs    + 'font/',

        soundSrc    = dev       + 'sound/',
        soundDest   = htdocs    + 'sound/';


/* NOTIFY */

    gulp.task('notify', function() {
        gulp.src("./src/test.ext")
            .pipe(plumber())
            .pipe(notify("Hello Gulp!"));
    });


/* CONCATENATE & MINIFY JS */

    gulp.task('minify-js', function() {
        gulp.src(jsSrc + '*.js')
            .pipe(sourcemaps.init())  // sourcemap, need separating files
            .pipe(plumber())
            .pipe(concat(jsSrc + '*.js'))
            .pipe(uglify())
            .pipe(rename(projectSlug + '.js'))
            .pipe(sourcemaps.write('./',  // sourcemap
                {
                    includeContent: false, // check options
                    sourceRoot: '../../',
                    debug: true
                }))
            .pipe(gulp.dest(jsDest))
            .pipe(livereload())
            .pipe(notify({
                title: projectName,
                onLast: true,
                message: 'JS',
                icon: null
        }));
    });


/* MINIFY HTML */

    gulp.task('minify-html', function() {
        gulp.src(dev + '*.html')
            .pipe(plumber())
            .pipe(htmlmini(
                {
                    collapseWhitespace: true
                }))
            .pipe(gulp.dest(htdocs))
            .pipe(livereload())
            .pipe(notify({
                title: projectName,
                onLast: true,
                message: 'HTML',
                icon: null
            }));
    });


/* SASS */

    gulp.task('sass', function () {
        return sass(cssSrc,
            {
                sourcemap: true,
                style: 'compressed'
            })
        .on('error', function (err) {
          console.error('Error!', err.message);
        })
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(
            {
                browsers: [ 'last 2 versions', // see https://github.com/ai/browserslist#queries for improvments
                            '> 1%',
                            'ie 9',
                            'iOS 6',
                            'Android 4']
            }))
        .pipe(gulp.dest(cssDest))
        .pipe(livereload())
        .pipe(notify({
            title: projectName,
            onLast: true,
            message: 'SASS',
            icon: null
        }));
    });


/* IMAGES */

gulp.task('minify-img', function() {
    return gulp.src(
        [imgSrc + '*', '!' + imgSrc + '*.ai'],
        {
            base: root,
            ignore: '*.ai'
        })
    .pipe(cache(imgmin(
        {
            optimizationLevel: 7,
            progressive: true,
            interlaced: true
        })))
    .pipe(livereload())
    .pipe(gulp.dest(imgDest));
});


/* PHP */

    gulp.task('copy-php', function() {
        gulp.src(dev + '*.php')
            .pipe(plumber())
            .pipe(gulp.dest(htdocs))
            .pipe(livereload())
            .pipe(notify({
                title: projectName,
                onLast: true,
                message: 'PHP',
                icon: null
        }));
    });


/* FONTS */

    gulp.task('copy-fonts', function() {
        gulp.src(fontSrc + '*')
            .pipe(plumber())
            .pipe(gulp.dest(fontDest))
            .pipe(livereload())
            .pipe(notify({
                title: projectName,
                onLast: true,
                message: 'FONTS',
                icon: null
        }));
    });


/* SOUNDS */

    gulp.task('copy-sounds', function() {
        gulp.src(soundSrc + '*')
            .pipe(plumber())
            .pipe(gulp.dest(soundDest))
            .pipe(livereload())
            .pipe(notify({
                title: projectName,
                onLast: true,
                message: 'SOUNDS',
                icon: null
        }));
    });


/* DEFAULT */

    gulp.task('default', [
            'minify-html',
            'sass',
            'minify-js',
            'copy-php',
            'copy-fonts',
            'copy-sounds',
            'minify-img',
            'notify',
            'watch'
        ], function() {
            var notification = new notificationCenter();
            notification.notify({
                title: projectName,
                message: 'Gugulped!'
            });
        });


/* WATCH */

    gulp.task('watch', function() {
        livereload.listen()
        gulp.watch(dev + '*.html',  ['minify-html'])
        gulp.watch(dev + '*.php',   ['copy-php'])
        gulp.watch(jsSrc + '*.js',  ['minify-js'])
        gulp.watch(cssSrc + '*',    ['sass'])
        gulp.watch(imgSrc + '*',    ['minify-img'])
        gulp.watch(fontSrc + '*',   ['copy-fonts'])
    });