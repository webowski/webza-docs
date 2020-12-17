module.exports = (gulp, tools) => {
	return done => {

		const { prompt } = tools.prompt;

		const question1 = [{
			type: 'select',
			name: 'serverType',
			message: 'Какой тип сервера?',
			choices: [
				'Статический (localhost)',
				'Хост (рабочий адрес типа domain.dev)',
			],
		}]

		const question2 = [{
			type: 'input',
			name: 'host',
			// message: 'Файл `build/config-special.js` будет перезаписан.\n  Введите свой тестовый адрес (например domain.dev):'
			message: 'Введите свой тестовый адрес (например domain.dev):'
		}]

		console.log('')

		prompt(question1)
			.then(res => {
				let file = './build/config-special.js'

				let content = `module.exports = () => {
						return {
							server: {
								type: 'static',
							}
						}
					}
					`;

				if (res.serverType === 'Статический (localhost)') {

					tools.fs.outputFileSync(file, content)
					console.log('')
					done()

				} else {

					prompt(question2)
						.then(res => {

							content = `module.exports = () => {
									return {
										server: {
											host: '${res.host}',
										}
									}
								}
								`;

							tools.fs.outputFileSync(file, content)

							console.log(
								'\n',
								' Адрес ' +
									tools.chalk.blue.bold( res.host ) +
									' записан в ' +
									tools.chalk.blue.bold( 'build/config-special.js' ),
								'\n'
							)

							done()
						})
						.catch(() => { return false })
				}
			})
			.catch(() => { return false })
	}
}
