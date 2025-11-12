'use strict';


define('forum/compose', ['hooks'], function (hooks) {
	const Compose = {};

	Compose.init = function () {
		const container = $('.composer');
		console.log('[dbg] forum/compose.init: container exists?', !!container.length);

		if (container.length) {
			hooks.fire('action:composer.enhance', {
				container: container,
			});

			let ready = true;

			container.on('click', '[data-action="post"]', function (e) {
				console.log('[dbg] forum/compose.click submit: handler invoked, ready=', ready);
				e.preventDefault();
				if (!ready) {
					console.log('[dbg] forum/compose.click submit: early return (not ready)');
					return;
				}

				const form = $('#compose-form');
				const bodyEl = container.find('textarea.write');
				const titleEl = container.find('[data-component="composer/title"] .title');
				const handleEl = container.find('[data-component="composer/handle"] .handle');

				const content = (bodyEl.val() || '').trimEnd();
				const title = titleEl.length ? (titleEl.val() || '').trim() : '';
				const handle = handleEl.length ? handleEl.val() : '';
				console.log('[dbg] forum/compose.click submit: values', {
					formExists: !!form.length,
					bodyLen: content.length,
					titlePresent: !!titleEl.length,
					handlePresent: !!handleEl.length,
					hasTid: !!form.find('input[name="tid"]').length,
					hasCid: !!form.find('input[name="cid"]').length,
					hasPid: !!form.find('input[name="pid"]').length,
					hasCsrf: !!form.find('input[name="_csrf"]').length,
				});

				// basic client-side length validation (mirrors quickreply)
				const min = parseInt(config.minimumPostLength, 10);
				const max = parseInt(config.maximumPostLength, 10);

				if (content.length < min) {
					return require(['alerts'], function (alerts) {
						alerts.error('[[error:content-too-short, ' + min + ']]');
					});
				}
				if (content.length > max) {
					return require(['alerts'], function (alerts) {
						alerts.error('[[error:content-too-long, ' + max + ']]');
					});
				}

				// ensure hidden inputs exist on the form
				function setHidden(name, value) {
					let input = form.find('input[name="' + name + '"]');
					if (!input.length) {
						input = $('<input type="hidden">').attr('name', name).appendTo(form);
					}
					input.val(value);
				}

				setHidden('content', content);
				if (titleEl.length) {
					setHidden('title', title);
				}
				if (handleEl.length) {
					setHidden('handle', handle);
				}

				ready = false;
				console.log('[dbg] forum/compose.click submit: submitting form to /compose');
				// native submit to server route (/compose) with CSRF token already present
				form.get(0).submit();
			});
		}
	};

	return Compose;
});
