module.exports = {

	styles: {
		separate: [
			'node_modules/@glidejs/glide/src/assets/sass/glide.core.scss',
			'node_modules/basiclightbox/src/styles/main.scss',
			'styles/specific/settings.scss',
			'styles/specific/test.css',
		],
		// will processed with concatenating to `styles/min/common.css`
		common: [
			'node_modules/@glidejs/glide/src/assets/sass/glide.core.scss',
			'styles/specific/test.css',
			'styles/common.scss',
		],
		critical: {
			css: [
				'path/to/file.css',
			],
			scss: 'styles/critical.scss'
		},
		beginningsToRemove: [
			'node_modules/',
			'styles/',
		],
		// prepend @imports for overriding scss variables of separate components
		prependImports: [
			'styles/base/_variables.scss',
			'styles/base/_mixins.scss',
			'styles/base/_mediaqueries.scss',
		]
	},

	scripts: {
		separate: {
			umd: [
				'node_modules/@glidejs/glide/dist/glide.min.js',
				'node_modules/basiclightbox/dist/basicLightbox.min.js',
				'scripts/components/Editor.js',
			],
			esm: [

			]
		},
		// will be concatenated to `scripts/min/common.js`
		common: {
			umd: [
				'scripts/components/Editor.js',
			],
			// esm imports file
			esm: 'scripts/common.js'
		},
		beginningsToRemove: [
			'node_modules/',
			'scripts/',
		]
	}

}