import resolve from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

export default {
	input: 'scripts/common.js',
	output: [
		{
			name: 'slider',
			file: `scripts/min/common.js`,
			format: 'iife',
			globals: {
				'swiper': 'Swiper'
			}
		}
	],
	plugins: [
		// commonjs(),
		resolve(),
		babel({
			exclude: 'node_modules/..',
			babelHelpers: 'bundled'
		})
	]
}
