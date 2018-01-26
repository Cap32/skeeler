import { registerKeywords } from './keywords';

export default function createPlugin(options = {}) {
	const { keywords, compile } = options;

	if (typeof compile !== 'function') {
		throw new Error('compile function is required');
	}

	if (keywords) {
		registerKeywords(keywords);
	}

	return compile;
}
