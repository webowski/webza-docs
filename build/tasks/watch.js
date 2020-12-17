module.exports = (gulp, tools) => {
	return () => {

		// Styles
		gulp.watch(
			[
				'styles/**/*.scss',
				'styles/**/*.css',
				'!styles/min/**/*',
			],
			{cwd: './'},
			gulp.series('styles')
		)

		// Vector icons
		gulp.watch(
			['images/vector-icons/*.svg'],
			{cwd: './'},
			gulp.series('icons')
		)

		// Scripts
		gulp.watch(
			[
				'scripts/**/*.js',
				'!scripts/min/**/*',
				'!scripts/app.min.js',
				'!scripts/footer-scripts.min.js',
			],
			{cwd: './'},
			gulp.series('scripts')
		)

		// Markup etc.
		gulp.watch(
			[
				'index.html',
			],
			{cwd: './'},
		).on('change', tools.browserSync.reload);

		// Templates
		gulp.watch(
			[
				'templates/**/*.mustache',
			],
			{cwd: './'},
			gulp.series('templates')
		)

		// PHP
		gulp.watch(
			['**/*.php', '!vendor', '!test'],
			{cwd: './'},
			gulp.series('browser-reload')
		)

	}
}
