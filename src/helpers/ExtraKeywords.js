const extraKeywords = new Map();

export function getExtraKeywords() {
	return extraKeywords;
}

export function setExtraKeywords(keywords) {
	for (const [key, creater] of keywords) {
		extraKeywords.set(key, creater);
	}
}
