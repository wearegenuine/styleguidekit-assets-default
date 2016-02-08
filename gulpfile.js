// load command line arguments 
var args = require('yargs').argv;

// load gulp 
var gulp = require('gulp');

// load the plugins 
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins({
  scope: ['devDependencies']
});
plugins.del = require("del");
plugins.mainBowerFiles = require("main-bower-files");

// clean tasks 
gulp.task('clean:bower', function(cb) {
  return plugins.del(['dist/bower_components/*'], cb);
});

gulp.task('clean:css-patternlab', function(cb) {
  return plugins.del(['dist/css/patternlab/*'], cb);
});

gulp.task('clean:css-custom', function(cb) {
  return plugins.del(['dist/css/custom/*'], cb);
});

gulp.task('clean:html', function(cb) {
  return plugins.del(['dist/html/*'], cb);
});

gulp.task('clean:js', function(cb) {
  return plugins.del(['dist/js/*'], cb);
});

// core tasks 
gulp.task('build:bower', ['clean:bower'], function() {
  return gulp.src(plugins.mainBowerFiles())
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest("dist/bower_components"));
    // .pipe(gulp.dest("../../../www/dist/styleguide/bower_components"));
});

gulp.task('build:css-general', function() {
  return gulp.src(['src/css/prism-okaidia.css'])
    .pipe(gulp.dest('dist/css/patternlab'))
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest('dist/css/patternlab'));
    // .pipe(gulp.dest('../../../www/.tmp/styleguide/css'))
    // .pipe(gulp.dest('../../../www/dist/styleguide/css'));
});

gulp.task('build:css-patternlab', ['clean:css-patternlab', 'build:css-general'], function() {
  return plugins.rubySass('src/sass/styleguide.scss', {
      style: 'expanded',
      "sourcemap=none": true
    })
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 version', 'safari 5', 'ie >= 8']
    }, {
      map: false
    }))
    .pipe(gulp.dest('dist/css/patternlab'))
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest('dist/css/patternlab'));
    // .pipe(gulp.dest('../../../www/.tmp/styleguide/css'))
    // .pipe(gulp.dest('../../../www/dist/styleguide/css'));
});

gulp.task('build:css-custom', ['clean:css-custom'], function() {
  return plugins.rubySass('src/sass/styleguide-specific.scss', {
      style: 'expanded',
      "sourcemap=none": true
    })
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 version', 'safari 5', 'ie >= 8']
    }, {
      map: false
    }))
    .pipe(gulp.dest('dist/css/custom'))
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest('dist/css/custom'));
    // .pipe(gulp.dest('../../../www/.tmp/styles'))
    // .pipe(gulp.dest('../../../www/dist/styles'));
});

gulp.task('build:html', ['clean:html'], function() {
  return gulp.src('src/html/*')
    .pipe(gulp.dest('dist/html'));
    // .pipe(gulp.dest('../../../www/.tmp'))
    // .pipe(gulp.dest('../../../www/dist'));
});

gulp.task('build:js-viewer', ['clean:js'], function() {
  return gulp.src(['src/js/*.js', '!src/js/annotations-pattern.js', '!src/js/code-pattern.js', '!src/js/info-panel.js'])
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.resolveDependencies({
      pattern: /\* @requires [\s-]*(.*?\.js)/g
    }))
    .on('error', function(err) {
      console.log(err.message);
    })
    .pipe(plugins.concat('patternlab-viewer.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist/js'));
    // .pipe(gulp.dest('../../../www/.tmp/styleguide/js'))
    // .pipe(gulp.dest('../../../www/dist/styleguide/js'));
});

gulp.task('build:js-pattern', ['build:js-viewer'], function() {
  return gulp.src(['src/js/postmessage.js', 'src/js/annotations-pattern.js', 'src/js/code-pattern.js', 'src/js/info-panel.js'])
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.resolveDependencies({
      pattern: /\* @requires [\s-]*(.*?\.js)/g
    }))
    .on('error', function(err) {
      console.log(err.message);
    })
    .pipe(plugins.concat('patternlab-pattern.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist/js'));
    // .pipe(gulp.dest('../../../www/.tmp/styleguide/js'))
    // .pipe(gulp.dest('../../../www/dist/styleguide/js'));
});

gulp.task('default', ['build:bower', 'build:css-custom', 'build:css-patternlab', 'build:html', 'build:js-pattern'], function() {
  if (args.watch !== undefined) {
    gulp.watch(['src/bower_components/**/*'], ['build:bower']);
    gulp.watch(['src/css/prism-okaidia.css'], ['build:css-general']);
    gulp.watch(['src/sass/styleguide.scss'], ['build:css-patternlab']);
    gulp.watch(['src/sass/styleguide-specific.scss'], ['build:css-custom']);
    gulp.watch(['src/html/*'], ['build:html']);
    gulp.watch(['src/js/*'], ['build:js-pattern']);
  }
});

