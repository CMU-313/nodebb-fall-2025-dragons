// test/stryker-setup.js
// Ensures `require.main` and `require.main.require` exist in Stryker’s sandbox.
// This fixes "Cannot set properties of undefined (setting 'require')" errors.

const Module = require('module');

// If Stryker's worker doesn't set require.main, mimic Node's default
if (!require.main) {
	Object.defineProperty(require, 'main', { value: module, writable: false });
}

// If tests use require.main.require(...), provide a compatible function
if (typeof require.main.require !== 'function') {
	const createReq = Module.createRequire ?
		Module.createRequire(process.cwd() + '/') :
		Module.createRequireFromPath(process.cwd() + '/'); // older Node fallback
	require.main.require = createReq;
}
