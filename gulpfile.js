var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')();

//***************************************************
// LINT & HINT
//***************************************************
gulp.task('lint', function() {
    gulp.src(['./**/*.js', '!./node_modules/**/*'])
        .pipe(plugins.jshint(require('./package.json').jshintConfig))
        .pipe(plugins.jshint.reporter('default'));
        // .pipe(plugins.jshint.reporter('fail'));
});

//***************************************************
// NODEMON
//***************************************************
gulp.task('nodemon', function() {

    var nodemon = plugins.nodemon({
        script: 'index.js',
        watch: ['.'],
        ignore: ['./test', 'gulpfile.js'],
        ext: 'js json',
        env: { 'ENV': 'PRODUCTION' }
    });

    nodemon.on('crash', function() {
        var delay = 3;
        nodemon.emit('restart', delay);
    });

    return nodemon;
});

gulp.task('nodemon-debug', ['lint'], function() {

    var nodemon = plugins.nodemon({
        script: 'index.js',
        watch: ['.'],
        tasks: ['lint'],
        ignore: ['./test', 'gulpfile.js'],
        ext: 'js json',
        env: { 'ENV': 'DEVELOPMENT' }
    });

    nodemon.on('crash', function() {
        var delay = 3;
        nodemon.emit('restart', delay);
    });

    return nodemon;
});


//***************************************************
// DEFAULT
//***************************************************
gulp.task('default',    ['nodemon-debug']);