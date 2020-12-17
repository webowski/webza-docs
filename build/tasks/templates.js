module.exports = (gulp, tools) => {
	return function () {

		return gulp.src("./templates/*.mustache")
			.pipe(tools.mustache({

			},{
				extension: '.html'
			}))
			// .pipe(tools.htmlmin({ collapseWhitespace: true }))
			.pipe(gulp.dest("./html"))
	}
}
