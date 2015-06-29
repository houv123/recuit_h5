var gulp = require('gulp');
var ugly = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var reload = require('gulp-livereload');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
gulp.task('minjs',function(){
     return gulp.src('./js/*.js')
         .pipe(ugly())
         .pipe(rename({suffix:'.min'}))
         .pipe(gulp.dest('./js'))
});

gulp.task('css',function(){
    return gulp.src('./css/*.css')
        .pipe(autoprefix('>1%,last 2 versions,ie 9'))
        .pipe(gulp.dest('./css'))
});

gulp.task('imagemin',function(){
   return gulp.src('./img/**/*')
       .pipe(imagemin({
           progressive: true,
           svgoPlugins: [{removeViewBox: false}],
           use: [pngquant()]
       }))
       .pipe(gulp.dest('./img'));
});
gulp.task('build',['imagemin','css']);
gulp.task('watch',function(){
    gulp.watch('./css/*.css',['css']);
});

