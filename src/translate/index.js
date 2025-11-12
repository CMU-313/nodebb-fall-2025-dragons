'use strict';

const translatorApi = module.exports;

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:0.5b';

const OLLAMA_OPTIONS = {
	num_ctx: 1024,
};

const LANG_SYSTEM_PROMPT = 'You are a language classifier. Detect the language of the input text and reply only with the English name of that language. If the input is empty, emojis, or gibberish, reply: Unknown';
const TRANS_SYSTEM_PROMPT = 'You are a translator. Translate the input text to English. Only output the translated text, nothing else. If the text is already English or unintelligible/emoji, return it unchanged.';

const THINK_TAG_REGEX = /<think>[\s\S]*?<\/think>/gi;

function normalizeModelContent(raw) {
	const pieces = Array.isArray(raw) ? raw : [raw];
	return pieces
		.map((piece) => {
			if (!piece) {
				return '';
			}
			if (typeof piece === 'string') {
				return piece;
			}
			if (typeof piece === 'object') {
				return piece.content || piece.text || '';
			}
			return '';
		})
		.join(' ')
		.replace(THINK_TAG_REGEX, '')
		.trim();
}

async function ollamaChat(systemPrompt, userText) {
	try {
		const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: OLLAMA_MODEL,
				stream: false,
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: userText || '' },
				],
				options: OLLAMA_OPTIONS,
			}),
		});
		if (!res.ok) {
			return '';
		}
		const data = await res.json();
		return normalizeModelContent(data && data.message && data.message.content);
	} catch (err) {
		return '';
	}
}

function normalizeDetectedLanguage(raw) {
	if (!raw) {
		return 'Unknown';
	}
	let out = String(raw).trim();
	const lowered = out.toLowerCase();
	const prefixes = ['language:', 'the language is', 'detected language:', 'output:'];
	for (const prefix of prefixes) {
		if (lowered.startsWith(prefix)) {
			out = out.slice(prefix.length).trim();
			break;
		}
	}
	if (out.includes('\n')) {
		out = out.split('\n', 1)[0].trim();
	}
	return out || 'Unknown';
}

/**
 * Translates post content and determines if it's English.
 * @param {Object} postData
 * @returns {Promise<[boolean, string]>} [isEnglish, translatedContent]
 */
translatorApi.translate = async function (postData) {
	const content = (postData && postData.content) ? String(postData.content) : '';
	if (!content || !content.trim()) {
		return [false, ''];
	}

	const langRaw = await ollamaChat(LANG_SYSTEM_PROMPT, content);
	const detected = normalizeDetectedLanguage(langRaw).toLowerCase();
	let isEnglish = detected === 'english';
	if (isEnglish && /[^\x00-\x7f]/.test(content)) {
		isEnglish = false;
	}
	if (isEnglish) {
		return [true, content];
	}

	const translated = await ollamaChat(TRANS_SYSTEM_PROMPT, content);
	if (!translated) {
		return [false, content];
	}
	const tLower = translated.toLowerCase();
	if (tLower.startsWith('error') || tLower.startsWith('i cannot')) {
		return [false, content];
	}
	return [false, translated];
};

