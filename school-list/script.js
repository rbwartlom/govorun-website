const initTimetableTabs = function(btn, elem) {
	const buttons = $(btn);
	const elements = $(elem);

	if (!elements[0]) return false;

	buttons[0] && buttons.on('click', function() {
		const button = $(this);
		const name = button.data('name');
		const element = elements.filter('[data-name="'+name+'"]');

		if (!button.hasClass('active') && element[0]) {
			buttons.removeClass('active');
			elements.removeClass('active');

			element.addClass('active');
			button.addClass('active');
		}
	});

	for (let t = 0; t < elements.length; t++) {
		const element = elements.eq(t);
		initFilter(element);
	}
}

const initFilter = function(tab) {
	const form = tab.find('.js-timetable-form');
	const blocks = tab.find('.js-timetable-block');
	const select = form.find('.js-timetable-select');
	const selectInputs = select.find('[data-element-input]');
	const checkboxes = form.find('.js-timetable-group');

	const filter = function() {
		const groups = [];
		const classes = [];

		checkboxes.filter(':checked').each(function() {
			groups.push($(this).attr('name'));
		});

		selectInputs.filter(':checked').each(function() {
			classes.push($(this).attr('name'));
		});

		for (let i = 0; i < blocks.length; i++) {
			const block = blocks.eq(i);
			const targetGroup = block.attr('data-group');
			const targetClass = targetGroup + ':' + block.attr('data-class');

			if (groups[0] == 'all' || groups.indexOf(targetGroup) != -1) {
				block.removeClass('hideGroup');
			} else {
				block.addClass('hideGroup');
			}

			if (!classes[0] || classes.indexOf(targetClass) != -1) {
				block.removeClass('hideClass');
			} else {
				block.addClass('hideClass');
			}
		}
	}

	initCheckboxes(checkboxes, {
		onChange: filter
	});

	initSelect(select, {
		onSubmit: filter
	});
}

const initCheckboxes = function(checkboxes, params = {}) {
	checkboxes.on('click', function(e) {
		const checkbox = $(this);
		const name = checkbox.attr('name');

		// if (!checkbox.prop('checked') && name === 'all') {
		// 	e.preventDefault();
		// 	return false;
		// }

		if (name === 'all') {
			checkboxes.filter(':not([name="all"])').prop('checked', false);
		} else {
			checkboxes.filter('[name="all"]').prop('checked', false);
		}
	});

	checkboxes.on('change', function(e) {
		params.onChange && params.onChange();
	});
}

const initSelect = function(select, params = {}) {
	const toggle = select.find('[data-element-toggle]');
	const close = select.find('[data-element-close]');
	const popup = select.find('[data-element-popup]');
	const inputs = select.find('[data-element-input]');
	const submit = select.find('[data-element-submit]');

	const openPopup = function() {
		select.addClass('open');
		popup.slideDown(200);
	}

	const closePopup = function() {
		select.removeClass('open');
		popup.slideUp(200);
	}

	toggle.on('click', function() {
		if (select.hasClass('open')) {
			closePopup();
		} else {
			openPopup();
		}
	});

	close.on('click', function() {
		closePopup();
		submit.addClass('disabled');
	});

	inputs.on('change', function() {
		submit.removeClass('disabled');
	});

	submit.on('click', function() {
		if (submit.hasClass('disabled') || !params.onSubmit) return false;
		closePopup();
		submit.addClass('disabled');
		params.onSubmit();
	});
}

const initToggleBlocks = function(selector) {
	const elements = $(selector);

	if (!elements[0]) return false;

	const open = function(element, content) {
		element.removeClass('close').addClass('open');
		content.slideDown(200);
	}

	const close = function(element, content) {
		element.addClass('close').removeClass('open');
		content.slideUp(200);
	}

	for (let i = 0; i < elements.length; i++) {
		const element = elements.eq(i);
		const button = element.find('[data-element-button]');
		const content = element.find('[data-element-content]');

		if (!element.hasClass('open')) {
			close(element, content);
		}

		button.on('click', function() {
			if (element.hasClass('open')) {
				close(element, content);
			} else {
				open(element, content);
			}
		})
	}
}

$(document).ready(function() {
	initTimetableTabs('.js-timetable-tab-button', '.js-timetable-tab-element');
	initToggleBlocks('.js-timetable-block');
});