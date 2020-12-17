const gulp =             require('gulp')

const tools = {
	// common
	config:              require('./build/config.js'),
	buffer:              require('vinyl-buffer'),
	source:              require('vinyl-source-stream'),
	streamify:           require('gulp-streamify'),
	// transform:           require('vinyl-transform'),
	// str:                 require('string-to-stream'),
	// es:                  require('event-stream'),
	merge:               require('merge2'),
	through:             require('through2'),
	fs:                  require('fs-extra'),
	path:                require('path'),
	rename:              require('gulp-rename'),

	// server
	browserSync:         require('browser-sync').create(),

	// graphic
	svgSprite:           require('gulp-svg-sprite'),
	svgmin:              require('gulp-svgmin'),

	// styles
	sass:                require('gulp-sass'),
	csso:                require('gulp-csso'),
	autoprefixer:        require('gulp-autoprefixer'),
	cleanCSS:            require('gulp-clean-css'),
	concatCss:           require('gulp-concat-css'),
	postcss:             require('gulp-postcss'),
	postcssCustomProps:  require('postcss-custom-properties'),

	// scripts
	rollup:              require('rollup'),
	babel:               require('@rollup/plugin-babel').default,
	resolve:             require('@rollup/plugin-node-resolve').default,
	commonjs:            require('@rollup/plugin-commonjs'),
	browserify:          require('browserify'),
	babelify:            require('babelify'),
	uglify:              require('gulp-terser'),
	concat:              require('gulp-concat'),

	// markup
	htmlmin:             require('gulp-htmlmin'),
	mustache:            require('gulp-mustache'),

	// console output
	prompt:              require('enquirer'),
	chalk:               require('chalk'),
}

const getTask = task => {
	return require('./build/tasks/' + task)(gulp, tools);
}

// Config
try {
	let configSpecial = require('./build/config-special.js')()
	tools.config = { ...tools.config, ...configSpecial }
} catch { }

gulp.task('config',       getTask('config'));

// Browsersync
gulp.task('browsersync',  getTask('browsersync'));

// Templates
gulp.task('templates',    getTask('templates'));

// Styles
gulp.task('styles',       getTask('styles'));

// Scripts
gulp.task('scripts',      getTask('scripts'))

// Vector icons sprite
gulp.task('icons',        getTask('icons'));

// Watch
gulp.task('watch',        getTask('watch'));

// Browser reload
gulp.task('browser-reload', () => { return tools.browserSync.reload() });

// Default
gulp.task('default', gulp.series(
	'templates',
	'styles',
	'icons',
	'scripts',
));

// Development
gulp.task('dev', gulp.parallel(
	'browsersync',
	'watch',
	'templates',
	'styles',
	'icons',
	'scripts',
));
