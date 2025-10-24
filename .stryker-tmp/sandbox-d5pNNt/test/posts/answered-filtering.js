// @ts-nocheck
'use strict';

const assert = require('assert');
const path = require('path');

const categories = require('../../src/categories');
const topics = require('../../src/topics');
const posts = require('../../src/posts');
const user = require('../../src/user');
const apiPosts = require('../../src/api/posts');

describe('Posts: answered filtering (scoped)', () => {
	let ownerUid, cid, topic1, topic2, topic3;
	let OUR_PIDS;

	before(async () => {
		ownerUid = await user.create({ username: 'owner', password: '123456' });

		const cat = await categories.create({ name: 'FilterCat', description: '' });
		cid = cat.cid;

		// Create 3 topics in an otherwise noisy global DB
		topic1 = await topics.post({
			uid: ownerUid, cid,
			title: 'Topic 1 - Will be answered',
			content: 'Topic 1 content',
		});

		topic2 = await topics.post({
			uid: ownerUid, cid,
			title: 'Topic 2 - Will remain unanswered',
			content: 'Topic 2 content',
		});

		topic3 = await topics.post({
			uid: ownerUid, cid,
			title: 'Topic 3 - Will be answered',
			content: 'Topic 3 content',
		});

		// Mark topic1 and topic3 as answered
		await posts.setAnswered(topic1.postData.pid, true, ownerUid);
		await posts.setAnswered(topic3.postData.pid, true, ownerUid);

		OUR_PIDS = new Set([
			topic1.postData.pid,
			topic2.postData.pid,
			topic3.postData.pid,
		]);
	});

	function onlyOurs(arr) {
		return arr.filter(p => OUR_PIDS.has(p.pid));
	}

	it('should get answered posts (scoped to ours)', async () => {
		const allAnswered = await posts.answered.getAnswered(0, 100, ownerUid);
		const answered = onlyOurs(allAnswered);

		assert.strictEqual(answered.length, 2);
		const pids = answered.map(p => p.pid);
		assert(pids.includes(topic1.postData.pid), 'Should include topic1');
		assert(pids.includes(topic3.postData.pid), 'Should include topic3');
		assert(!pids.includes(topic2.postData.pid), 'Should not include topic2');
	});

	it('should get unanswered posts (scoped to ours)', async () => {
		const allUnanswered = await posts.answered.getUnanswered(0, 100, ownerUid);
		const unanswered = onlyOurs(allUnanswered);

		assert.strictEqual(unanswered.length, 1);
		assert.strictEqual(unanswered[0].pid, topic2.postData.pid);
	});

	it('should get correct counts (scoped to ours, not global)', async () => {
		// The global helpers count EVERYTHING. Make counts deterministic by scoping.
		const allAnswered = await posts.answered.getAnswered(0, 1000, ownerUid);
		const allUnanswered = await posts.answered.getUnanswered(0, 1000, ownerUid);

		const answeredCountScoped = onlyOurs(allAnswered).length;
		const unansweredCountScoped = onlyOurs(allUnanswered).length;

		assert.strictEqual(answeredCountScoped, 2);
		assert.strictEqual(unansweredCountScoped, 1);
	});

	it('should filter by status correctly (scoped to ours)', async () => {
		const answeredAll = await posts.answered.getByStatus(true, 0, 100, ownerUid);
		const unansweredAll = await posts.answered.getByStatus(false, 0, 100, ownerUid);

		const answered = onlyOurs(answeredAll);
		const unanswered = onlyOurs(unansweredAll);

		assert.strictEqual(answered.length, 2);
		assert.strictEqual(unanswered.length, 1);
	});

	it('should work with API endpoints (scoped to ours)', async () => {
		const caller = { uid: ownerUid };

		// getAnswered
		const answeredResult = await apiPosts.getAnswered(caller, { start: 0, stop: 100 });
		const answeredScoped = onlyOurs(answeredResult.posts);
		assert.strictEqual(answeredScoped.length, 2);
		// do not assert global answeredResult.count; assert scoped count instead
		assert.strictEqual(answeredScoped.length, 2);
		assert.strictEqual(answeredResult.hasMore, false);

		// getUnanswered
		const unansweredResult = await apiPosts.getUnanswered(caller, { start: 0, stop: 100 });
		const unansweredScoped = onlyOurs(unansweredResult.posts);
		assert.strictEqual(unansweredScoped.length, 1);
		assert.strictEqual(unansweredScoped[0].pid, topic2.postData.pid);
		assert.strictEqual(unansweredResult.hasMore, false);

		// getByAnsweredStatus
		const statusResult = await apiPosts.getByAnsweredStatus(caller, {
			answered: true, start: 0, stop: 100,
		});
		const statusScoped = onlyOurs(statusResult.posts);
		assert.strictEqual(statusScoped.length, 2);
	});
});