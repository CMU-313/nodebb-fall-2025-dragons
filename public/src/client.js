'use strict';

console.log('[dbg] scripts-client entry: client.js loaded');
require('./app');

// scripts-client.js is generated during build, it contains javascript files
// from plugins that add files to "scripts" block in plugin.json
require('../scripts-client');

console.log('[dbg] scripts-client entry: invoking app.onDomReady');
app.onDomReady();
