import { setExtraKeywords } from './helpers/ExtraKeywords';

export default function createPlugin(options = {}) {
	const { keywords, compile } = options;
	if (keywords) {
		setExtraKeywords(keywords);
	}
	return compile;
}
