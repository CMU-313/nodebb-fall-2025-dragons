// src/posts/answered.js
'use strict';
const db = require('../database');

// src/posts/answered.js
module.exports = function (Posts) {
	Posts.answered = Posts.answered || {};

	Posts.answered.set = async (pid, answered) => {
		const tid = await Posts.getPostField(pid, 'tid');
		await db.setObjectField(`post:${pid}`, 'answered', answered ? 1 : 0);
		if (answered) {
			const score = Date.now();
			await db.sortedSetAdd('posts:answered', score, pid);
			await db.sortedSetAdd(`tid:${tid}:answered`, score, pid);
		} else {
			await db.sortedSetRemove('posts:answered', pid);
			await db.sortedSetRemove(`tid:${tid}:answered`, pid);
		}
	};

	Posts.answered.mark = async (pid /*, uid */) => {
		await Posts.answered.set(pid, true);
	};

	Posts.answered.unmark = async (pid /*, uid */) => {
		await Posts.answered.set(pid, false);
	};
};