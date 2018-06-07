// Require our dependencies
var autoprefixer = require('autoprefixer');
var bourbon = require('bourbon').includePaths;
var browserSync = require('browser-sync');
var cheerio = require('gulp-cheerio');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var mqpacker = require('css-mqpacker');
var neat = require('bourbon-neat').includePaths;
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var sort = require('gulp-sort');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var uglify = require('gulp-uglify');
var wpPot = require('gulp-wp-pot');
var stylelint = require('stylelint');
var configWordPress = require("stylelint-config-wordpress")

// Set assets paths.
var paths = {
	css: ['./assets/css/*.css', '!./assets/css/*.min.css'],
	php: ['./*.php', './**/*.php'],
	sass: './assets/sass/**/*.scss',
	scripts: ['./assets/js/*.js', '!./assets/js/*.min.js'],
	concat_scripts: './assets/js/concat/*.js',
	dist: '../../../../radish-concepts-cookie-consent-dist/'
};

/**
 * Handle errors and alert the user.
 */
function handleErrors() {
	var args = Array.prototype.slice.call(arguments);

	notify.onError({
		title: 'Task Failed [<%= error.message %>',
		message: 'See console.',
		sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	}).apply(this, args);

	gutil.beep(); // Beep 'sosumi' again

	// Prevent the 'watch' task from stopping
	this.emit('end');
}

/**
 * Delete style.css and style.min.css before we minify and optimize
 */
gulp.task('clean:styles', function () {
	return del(['./assets/css/radish-cookie-consent.css', './assets/css/radish-cookie-consent.min.css'])
});

/**
 * Compile Sass and run stylesheet through PostCSS.
 *
 * https://www.npmjs.com/package/gulp-sass
 * https://www.npmjs.com/package/gulp-postcss
 * https://www.npmjs.com/package/gulp-autoprefixer
 * https://www.npmjs.com/package/css-mqpacker
 */
gulp.task('postcss', ['clean:styles'], function () {
	return gulp.src('./assets/sass/*.scss', paths.css)

	// Deal with errors.
		.pipe(plumber({errorHandler: handleErrors}))

		// Wrap tasks in a sourcemap.
		.pipe(sourcemaps.init())

		// Compile Sass using LibSass.
		.pipe(sass({
			includePaths: [].concat(bourbon, neat),
			errLogToConsole: true,
			outputStyle: 'expanded' // Options: nested, expanded, compact, compressed
		}))

		// Parse with PostCSS plugins.
		.pipe(postcss([
			autoprefixer({
				browsers: ['last 2 version']
			}),
			mqpacker({
				sort: true
			}),
			stylelint(configWordPress) // use stylelint-config-wordpress
		]))

		// Create sourcemap.
		.pipe(sourcemaps.write())

		// Create style.css.
		.pipe(gulp.dest('./assets/css/'))
		.pipe(browserSync.stream());
});

/**
 * Minify and optimize style.css.
 *
 * https://www.npmjs.com/package/gulp-cssnano
 */
gulp.task('cssnano', ['postcss'], function () {
	return gulp.src('./assets/css/radish-cookie-consent.css')
		.pipe(plumber({errorHandler: handleErrors}))
		.pipe(cssnano({
			safe: true // Use safe optimizations
		}))
		.pipe(rename('radish-cookie-consent.min.css'))
		.pipe(gulp.dest('./assets/css/'))
		.pipe(browserSync.stream());
});

/**
 * Sass linting
 *
 * https://www.npmjs.com/package/sass-lint
 */
gulp.task('sass:lint', ['cssnano'], function () {
	gulp.src([
		'sass/**/*.scss',
		'!sass/defaults/_sprites.scss'
	])
		.pipe(sassLint())
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError());
});


/**
 * Delete scripts before we concat and minify
 */
gulp.task('clean:scripts', function () {
	return del(['.assets/js/radish-cookie-consent.js', './assets/js/radish-cookie-consent.min.js']);
});

/**
 * Concatenate javascripts after they're clobbered.
 * https://www.npmjs.com/package/gulp-concat
 */
gulp.task('concat', ['clean:scripts'], function () {
	return gulp.src(paths.concat_scripts)
		.pipe(plumber({errorHandler: handleErrors}))
		.pipe(sourcemaps.init())
		.pipe(concat('radish-cookie-consent.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./assets/js'))
		.pipe(browserSync.stream());
});

/**
 * Minify javascripts after they're concatenated.
 * https://www.npmjs.com/package/gulp-uglify
 */
gulp.task('uglify', ['concat'], function () {
	return gulp.src(paths.scripts)
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify({
			mangle: false
		}))
		.pipe(gulp.dest('./assets/js'));
});

/**
 * Delete the theme's .pot before we create a new one
 */
gulp.task('clean:pot', function () {
	return del(['languages/radish-cookie-consent.pot']);
});

/**
 * Scan the theme and create a POT file.
 *
 * https://www.npmjs.com/package/gulp-wp-pot
 */
gulp.task('wp-pot', ['clean:pot'], function () {
	return gulp.src(paths.php)
		.pipe(plumber({errorHandler: handleErrors}))
		.pipe(sort())
		.pipe(wpPot({
			domain: 'radish-cookie-consent',
			destFile: 'radish-cookie-consent.pot',
			package: 'radish-cookie-consent',
			bugReport: 'https://github.com/radishconcepts/radish-cookie-consent/issues',
			lastTranslator: 'Translator <translations@radishconcepts.com>',
			team: 'Translations Team <translations@radishconcepts.com>'
		}))
		.pipe(gulp.dest('languages/'));
});

/**
 * Process tasks and reload browsers on file changes.
 *
 * https://www.npmjs.com/package/browser-sync
 */
gulp.task('watch', function () {

	// Kick off BrowserSync.
	browserSync({
		open: false,                  // Open project in a new tab?
		injectChanges: true,          // Auto inject changes instead of full reload
		proxy: "isv-sandbox.localhost",  // Use http://isv-sandbox.localhost:3000 to use BrowserSync
		watchOptions: {
			debounceDelay: 1000       // Wait 1 second before injecting
		}
	});

	// Run tasks when files change.
	gulp.watch(paths.sass, ['styles']);
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.concat_scripts, ['scripts']);
});

gulp.task('cleandist', function () {
	return del([paths.dist + '**/*', '!.svn/**/*'], {force: true});
});

gulp.task('dist', function () {
	gulp.src(['./**/*.*', '!Gulpfile.js', '!package.json', '!node_modules/**', '!./assets/sass/**', '!./assets/js/concat/**'])
		.pipe(gulp.dest(paths.dist));
});

/**
 * Create indivdual tasks.
 */
gulp.task('i18n', ['wp-pot']);
gulp.task('scripts', ['uglify']);
gulp.task('styles', ['cssnano']);
gulp.task('default', ['i18n', 'styles', 'scripts']);
gulp.task('deploy', ['cleandist', 'dist']);
