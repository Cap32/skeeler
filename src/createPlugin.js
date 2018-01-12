import { setExtraKeywords } from './helpers/ExtraKeywords';

export default function createPlugin(options = {}) {
	const { newKeywords, toExport } = options;
	if (newKeywords) { setExtraKeywords(newKeywords); }
	return toExport;
}
