const fixed = function() {
	if (!document.body.classList.contains('disable-scroll')) {
		let pagePosition = window.scrollY;
		document.body.classList.add('disable-scroll');
		document.body.dataset.position = pagePosition;
		document.body.style.top = -pagePosition + 'px';
	}
}

const unfixed = function() {
	if (document.body.classList.contains('disable-scroll')) {
		let pagePosition = parseInt(document.body.dataset.position, 10);
		document.body.style.top = 'auto';
		document.body.classList.remove('disable-scroll');
		window.scroll({ top: pagePosition, left: 0 });
		document.body.removeAttribute('data-position');
	}
}

const initTimetableTabs = function(btn, elem) {
	const buttons = $(btn);
	const elements = $(elem);

	if (!elements[0]) return false;

	buttons[0] && buttons.on('click', function() {
		const button = $(this);
		const name = button.data('name');
		const element = elements.filter('[data-name="'+name+'"]');

		if (!button.hasClass('active') && element[0]) {
			const btnAll = element.find('.js-timetable-group[name="all"]:not(:checked)')
			buttons.removeClass('active');
			elements.removeClass('active');

			element.addClass('active');
			button.addClass('active');

			btnAll && btnAll.trigger('click');
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

			block.removeClass('hide');

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
		onChange: function() {
			const inputs = select.find('[data-element-input]');
			inputs.prop('checked', false);

			filter();
		}
	});

	initSelect(select, {
		onSubmit: function(inputs) {
			checkboxes.prop('checked', false);

			if (inputs[0]) {
				inputs.filter(':checked').each(function() {
					const group = $(this).attr('name').split(':')[0];
					checkboxes.filter('[name="'+group+'"]').prop('checked', true);
				});
			} else {
				checkboxes.filter('[name="all"]').prop('checked', true);
			}

			filter();
		}
	});
}

const initCheckboxes = function(checkboxes, params = {}) {
	checkboxes.on('click', function(e) {
		const checkbox = $(this);
		const name = checkbox.attr('name');

		if (!checkbox.prop('checked')) {
			e.preventDefault();
			return false;
		}

		checkboxes.filter(':not([name="'+name+'"])').prop('checked', false);
	});

	checkboxes.on('change', function(e) {
		params.onChange && params.onChange();
	});
}

const initSelect = function(select, params = {}) {
	const toggle = select.find('[data-element-toggle]');
	const close = select.find('[data-element-close]');
	const back = select.find('[data-element-back]');
	const popup = select.find('[data-element-popup]');
	const inputs = select.find('[data-element-input]');
	const submit = select.find('[data-element-submit]');

	const openPopup = function() {
		inputs.prop('checked', false);
		submit.addClass('disabled');
		select.addClass('open');
		back.fadeIn(200);
		popup.slideDown(200, function() {
			window.innerWidth < 768 && popup.css('height', popup.innerHeight());
		});
		window.innerWidth < 768 && fixed();
	}

	const closePopup = function() {
		select.removeClass('open');
		back.fadeOut(200);
		popup.css('height', 'auto');
		popup.slideUp(200);
		unfixed();
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
	});

	inputs.on('change', function() {
		const lengthChecked = inputs.filter(':checked').length;
		if (lengthChecked) {
			submit.removeClass('disabled');
		} else {
			submit.addClass('disabled');
		}
	});

	submit.on('click', function() {
		if (submit.hasClass('disabled') || !params.onSubmit) return false;
		closePopup();
		params.onSubmit(inputs.filter(':checked'));
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

		// if (!element.hasClass('open')) {
		// 	close(element, content);
		// }

		button.on('click', function() {
			if (element.hasClass('open')) {
				close(element, content);
			} else {
				open(element, content);
			}
		})
	}
}

const initCloseOpenedSelects = function(className) {
	$(document).on('click', function(e) {
		const item = $(e.target);

		if (!item.hasClass(className) && !item.parents('.' + className)[0]) {
			const select = $('.' + className+'.open');
			const back = select.find('[data-element-back]');
			const popup = select.find('[data-element-popup]');
			select.removeClass('open');
			back.fadeOut(200);
			popup.css('height', 'auto');
			popup.slideUp(200);
			unfixed();
		}
	});
}

$(document).ready(function() {
	initTimetableTabs('.js-timetable-tab-button', '.js-timetable-tab-element');
	initToggleBlocks('.js-timetable-block');
	initCloseOpenedSelects('js-timetable-select');
});