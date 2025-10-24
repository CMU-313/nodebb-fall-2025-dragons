// test/stryker-sanity.spec.js
const assert = require('assert');
const promisify = require('../src/promisify.js');

describe('promisify (object mutator)', function () {
	it('adds Promise support to callback-style fn and callback support to async fn', async function () {
		const mod = {
			// MUST use the param name "callback" so isCallbackedFunction() detects it
			add(x, y, callback) { setTimeout(() => callback(null, x + y), 0); },
			asyncDouble: async (x) => x * 2,
		};

		// mutate in place
		promisify(mod);

		// 1) callback-style now also returns a Promise when no callback is passed
		const sum = await mod.add(20, 22);
		assert.strictEqual(sum, 42);

		// still supports the original callback form
		await new Promise((resolve, reject) => {
			mod.add(1, 2, (err, res) => (err ? reject(err) : (assert.strictEqual(res, 3), resolve())));
		});

		// 2) async fn still works as Promise…
		const doubled = await mod.asyncDouble(21);
		assert.strictEqual(doubled, 42);

		// …and now ALSO accepts a Node-style callback
		await new Promise((resolve, reject) => {
			mod.asyncDouble(5, (err, res) => (err ? reject(err) : (assert.strictEqual(res, 10), resolve())));
		});
	});
});