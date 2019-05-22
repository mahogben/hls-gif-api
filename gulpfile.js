'use strict'

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('serve', function() {
    nodemon({
        script: 'app.js',
        ext: 'js handlebars coffee',
        env: {
            NODE_ENV: 'dev',
            PORT: 9090
        },
        ignore: ['./node_modules/**']
    });
});