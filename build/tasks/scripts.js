module.exports = (gulp, tools) => {

	// make a destination folder
	const makeDest = vinyl => {

		vinyl.path = tools.path.relative(vinyl.cwd, vinyl.path)

		let file = {
			name:    tools.path.parse(vinyl.path).name,
			ext:     tools.path.parse(vinyl.path).ext,
			dir:     tools.path.dirname(vinyl.path)
		}

		let beginningsToRemove = tools.config.scripts.beginningsToRemove

		beginningsToRemove.forEach(function(part) {
			let regexp = new RegExp('^' + part)
			file.dir = file.dir.replace(regexp, '')
		})

		file.dest = './scripts/min/' + file.dir + '/'
		tools.fs.mkdirsSync( file.dest )

		return file.dest
	}

	return () => {

		let scripts = tools.config.scripts

		let streamSeparate = gulp.src(scripts.separate.umd, {
				cwd: './',
				nosort: true,
			})
			.pipe(tools.uglify({
				output: {
					comments: false,
				}
			}))
			.on('error', () => {
				console.log.bind(console, '\007')
			})
			.pipe(tools.through.obj( (vinyl, encoding, callback) => {

				// переделать
				let dest = makeDest(vinyl)
				let scriptsPath = dest + vinyl.relative
				let content = vinyl.contents.toString(encoding)

				tools.fs.outputFileSync( scriptsPath, content, err => {
					console.log( err );
				})

				callback(null, vinyl);
			}))

		let streamCommon = tools.merge([

				// umd
				gulp.src( scripts.common.umd, {
					cwd: './',
					nosort: true,
					allowEmpty: true,
				}),

				// esm
				gulp.src('scripts/common.js', {
						cwd: './',
						nosort: true,
					})
					.pipe(tools.through.obj( (vinyl, encoding, callback) => {

						tools.rollup.rollup({
							input: 'scripts/common.js',
							plugins: [
								tools.commonjs(),
								tools.resolve(),
								tools.babel({
									exclude: 'node_modules/..',
									babelHelpers: 'bundled'
								})
							]
						}).then( bundle => {
							bundle.generate({
								name: 'bundle',
								format: 'umd',
								globals: {
									'swiper': 'Swiper'
								}
							}).then(output => {

								vinyl.contents = Buffer.from(output.output[0].code, 'utf8' )

								callback(null, vinyl)
							})
						})

					}))
				// 	// .pipe(tools.rename('bundle'))
				// 	// .pipe(tools.source('bundle.js'))
				// 	// .pipe(tools.buffer())
			])
			.pipe(tools.streamify(tools.concat('common.js')))
			.pipe(tools.uglify({
				output: {
					comments: false,
				}
			}))
			.pipe(gulp.dest('./scripts/min'))
			.pipe(tools.browserSync.stream())

		return tools.merge( streamSeparate, streamCommon )

	}
}
