let statElements = document.body.querySelectorAll('[data-goal]')

statElements.forEach(element => {
	let goal = element.dataset.goal
	let targetEvent = 'click'

	if (element.tagName === 'SELECT') targetEvent = 'change'

	element.addEventListener(targetEvent, e => {
		if (window.yaCounter65724 !== undefined) {
			yaCounter65724.reachGoal(goal)
		}
		return true
	})

})

// data-goal="{'click', 'OPENLS'}"
