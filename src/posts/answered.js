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

	// Get answered posts (main posts only)
	Posts.answered.getAnswered = async function (start, stop, uid) {
		const pids = await db.getSortedSetRevRange('posts:answered', start, stop);
		return await Posts.getPostsByPids(pids, uid);
	};

	// Get unanswered posts (main posts that are not answered)
	Posts.answered.getUnanswered = async function (start, stop, uid) {
		// Get all main posts (from topics)
		const allTids = await db.getSortedSetRange('topics:tid', 0, -1);
		const mainPids = await Promise.all(
			allTids.map(tid => db.getObjectField(`topic:${tid}`, 'mainPid'))
		);
		
		// Filter out null/undefined mainPids
		const validMainPids = mainPids.filter(pid => pid);
		
		// Get answered PIDs
		const answeredPids = await db.getSortedSetMembers('posts:answered');
		
		// Find unanswered main posts
		const unansweredPids = validMainPids.filter(pid => !answeredPids.includes(pid));
		
		// Paginate
		const paginatedPids = unansweredPids.slice(start, stop + 1);
		
		return await Posts.getPostsByPids(paginatedPids, uid);
	};

	// Get posts by answered status (true = answered, false = unanswered)
	Posts.answered.getByStatus = async function (answered, start, stop, uid) {
		if (answered) {
			return await Posts.answered.getAnswered(start, stop, uid);
		} else {
			return await Posts.answered.getUnanswered(start, stop, uid);
		}
	};

	// Get count of answered posts
	Posts.answered.getAnsweredCount = async function () {
		return await db.sortedSetCard('posts:answered');
	};

	// Get count of unanswered posts
	Posts.answered.getUnansweredCount = async function () {
		const allTids = await db.sortedSetCard('topics:tid');
		const answeredCount = await Posts.answered.getAnsweredCount();
		return allTids - answeredCount;
	};
};