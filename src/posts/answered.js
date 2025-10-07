// src/posts/answered.js
'use strict';
const db = require('../database');

// src/posts/answered.js
module.exports = function (Posts) {
	Posts.answered = Posts.answered || {};

	Posts.answered.set = async (pid, answered) => {
		console.log('[answered] set start pid=%s answered=%s', pid, answered);
		
		// Only allow main posts to be marked as answered
		const isMainPost = await Posts.isMain(pid);
		if (!isMainPost) {
			throw new Error('[[error:only-main-posts-can-be-answered]]');
		}
		
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
		console.log('[answered] set done pid=%s', pid);
	};

	Posts.answered.mark = async (pid /*, uid */) => {
		console.log('[answered] mark pid=%s', pid);
		await Posts.answered.set(pid, true);
	};

	Posts.answered.unmark = async (pid /*, uid */) => {
		console.log('[answered] unmark pid=%s', pid);
		await Posts.answered.set(pid, false);
	};
};