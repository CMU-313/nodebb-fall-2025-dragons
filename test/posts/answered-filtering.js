'use strict';

const assert = require('assert');
const db = require('../mocks/databasemock');
const categories = require('../../src/categories');
const topics = require('../../src/topics');
const posts = require('../../src/posts');
const user = require('../../src/user');
const apiPosts = require('../../src/api/posts');

describe('Posts: answered filtering', () => {
	let ownerUid, cid, topic1, topic2, topic3;

	before(async () => {
		ownerUid = await user.create({ username: 'owner', password: '123456' });

		const cat = await categories.create({ name: 'FilterCat', description: '' });
		cid = cat.cid;

		// Create 3 topics
		topic1 = await topics.post({
			uid: ownerUid,
			cid,
			title: 'Topic 1 - Will be answered',
			content: 'Topic 1 content',
		});

		topic2 = await topics.post({
			uid: ownerUid,
			cid,
			title: 'Topic 2 - Will remain unanswered',
			content: 'Topic 2 content',
		});

		topic3 = await topics.post({
			uid: ownerUid,
			cid,
			title: 'Topic 3 - Will be answered',
			content: 'Topic 3 content',
		});

		// Mark topic1 and topic3 as answered
		await posts.setAnswered(topic1.postData.pid, true, ownerUid);
		await posts.setAnswered(topic3.postData.pid, true, ownerUid);
	});

	it('should get answered posts', async () => {
		const answeredPosts = await posts.answered.getAnswered(0, 10, ownerUid);
		assert.strictEqual(answeredPosts.length, 2);
		
		const pids = answeredPosts.map(p => p.pid);
		assert(pids.includes(topic1.postData.pid), 'Should include topic1');
		assert(pids.includes(topic3.postData.pid), 'Should include topic3');
		assert(!pids.includes(topic2.postData.pid), 'Should not include topic2');
	});

	it('should get unanswered posts', async () => {
		const unansweredPosts = await posts.answered.getUnanswered(0, 10, ownerUid);
		assert.strictEqual(unansweredPosts.length, 1);
		assert.strictEqual(unansweredPosts[0].pid, topic2.postData.pid);
	});

	it('should get correct counts', async () => {
		const answeredCount = await posts.answered.getAnsweredCount();
		const unansweredCount = await posts.answered.getUnansweredCount();
		
		assert.strictEqual(answeredCount, 2);
		assert.strictEqual(unansweredCount, 1);
	});

	it('should filter by status correctly', async () => {
		const answered = await posts.answered.getByStatus(true, 0, 10, ownerUid);
		const unanswered = await posts.answered.getByStatus(false, 0, 10, ownerUid);
		
		assert.strictEqual(answered.length, 2);
		assert.strictEqual(unanswered.length, 1);
	});

	it('should work with API endpoints', async () => {
		const caller = { uid: ownerUid };
		
		// Test getAnswered API
		const answeredResult = await apiPosts.getAnswered(caller, { start: 0, stop: 10 });
		assert.strictEqual(answeredResult.posts.length, 2);
		assert.strictEqual(answeredResult.count, 2);
		assert.strictEqual(answeredResult.hasMore, false);

		// Test getUnanswered API
		const unansweredResult = await apiPosts.getUnanswered(caller, { start: 0, stop: 10 });
		assert.strictEqual(unansweredResult.posts.length, 1);
		assert.strictEqual(unansweredResult.count, 1);
		assert.strictEqual(unansweredResult.hasMore, false);

		// Test getByAnsweredStatus API
		const statusResult = await apiPosts.getByAnsweredStatus(caller, { 
			answered: true, 
			start: 0, 
			stop: 10 
		});
		assert.strictEqual(statusResult.posts.length, 2);
		assert.strictEqual(statusResult.count, 2);
	});
});
