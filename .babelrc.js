module.exports = {
	"presets": [
		["@babel/env", {
			"modules": false,
            "targets": {
                "ie": "11"
            },
            "useBuiltIns": "usage",
            "corejs": 3
		}]
	],
	// "plugins": [
	// 	"@babel/plugin-transform-modules-umd"
	// ]
}
