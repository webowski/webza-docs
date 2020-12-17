module.exports = (gulp, tools) => {

	// add overriding scss variables to plugin scss
	const prependScss = vinyl => {

		let prependImports = tools.config.styles.prependImports
		let scssPrepend = ''

		prependImports.forEach(function(line) {
			scssPrepend += '@import \'./' + line + '\';\n'
		})

		let newContents = Buffer.concat([
			Buffer.from( scssPrepend ),
			vinyl.contents
		])

		vinyl.contents = newContents

		return vinyl
	}


	// make a css destination folder
	const makeCssDest = vinyl => {

		vinyl.path = tools.path.relative(vinyl.cwd, vinyl.path)

		let file = {
			name:    tools.path.parse(vinyl.path).name,
			ext:     tools.path.parse(vinyl.path).ext,
			dir:     tools.path.dirname(vinyl.path)
		}

		let beginningsToRemove = tools.config.styles.beginningsToRemove

		beginningsToRemove.forEach(function(part) {
			let regexp = new RegExp('^' + part)
			file.dir = file.dir.replace(regexp, '')
		})

		file.dest = './styles/min/' + file.dir + '/'

		tools.fs.mkdirsSync( file.dest )

		return file.dest
	}


	// filter files array by extension
	const filterByExt = (files, ext) => {

		let filtered = []

		files.forEach( item => {
			if (tools.path.extname(item) === ext) {
				filtered.push(item)
			}
		})

		return filtered
	}


	return () => {

		let styles = tools.config.styles


		// separate styles
		let stylesSeparateScss = filterByExt( styles.separate, '.scss' )
		let stylesSeparateCss = filterByExt( styles.separate, '.css' )

		let streamSeparate = gulp.src(stylesSeparateScss, {
				cwd: './',
				nosort: true,
				allowEmpty: true,
			})
			.pipe(tools.through.obj( (vinyl, encoding, callback) => {

				vinyl = prependScss(vinyl);

				callback(null, vinyl);
			}))
			.pipe(tools.sass({
					outputStyle: 'compressed'
				})
				.on('error', console.log.bind(console, '\007'))
			)
			.pipe(tools.postcss([
				// postcssImport(),
				tools.postcssCustomProps(),
			]))
			// add css files
			.pipe(gulp.src(stylesSeparateCss, {
				cwd: './',
				nosort: true,
				allowEmpty: true,
			}))
			.pipe(tools.autoprefixer())
			.pipe(tools.csso())
			.pipe(tools.through.obj( (vinyl, encoding, callback) => {

				let cssDest = makeCssDest(vinyl)
				let cssPath = cssDest + vinyl.relative
				let cssContent = vinyl.contents.toString(encoding)

				tools.fs.outputFileSync( cssPath, cssContent, err => {
					console.log( err );
				})

				callback(null, vinyl);
			}))
			.pipe(tools.browserSync.stream())


		// common styles
		let stylesCommon = styles.common.filter( item => {
			return ! item.match(/^styles\/common\.scss/)
		})

		let streamCommon = tools.merge()


		// additional *.css from *.scss
		let stylesCommonScss = filterByExt( stylesCommon, '.scss' )

		if (stylesCommonScss.length) {
			let streamCommonScss = gulp.src( stylesCommonScss, {
					cwd: './',
					nosort: true,
					allowEmpty: true,
				})
				.pipe(tools.through.obj( (vinyl, encoding, callback) => {

					vinyl = prependScss(vinyl);

					callback(null, vinyl);
				}))
				.pipe(tools.sass({
						outputStyle: 'compressed'
					})
					.on('error', console.log.bind(console, '\007'))
				)
				.pipe(tools.postcss([
					// postcssImport(),
					tools.postcssCustomProps(),
				]))

			streamCommon.add(streamCommonScss)
		}


		// additional simple css files
		let stylesCommonCss = filterByExt( stylesCommon, '.css' )

		if (stylesCommonCss.length) {
			let streamCommonCss = gulp.src(stylesCommonCss, {
				cwd: './',
				nosort: true,
			})

			streamCommon.add(streamCommonCss)
		}


		// common.css from common.scss
		let streamCommonCommon = gulp.src('styles/common.scss', {
				cwd: './',
			})
			.pipe(tools.sass({
					outputStyle: 'compressed'
				})
				.on('error', console.log.bind(console, '\007'))
			)
			.pipe(tools.postcss([
				// postcssImport(),
				tools.postcssCustomProps(),
			]))

		streamCommon.add(streamCommonCommon)


		// concat additional simple css + common.css
		streamCommon = streamCommon
			.pipe(tools.concatCss('common.css'))
			.pipe(tools.autoprefixer())
			.pipe(tools.csso())
			.pipe(gulp.dest('./styles/min/'))
			.pipe(tools.browserSync.stream())


		return tools.merge( streamSeparate, streamCommon )
    }
}
