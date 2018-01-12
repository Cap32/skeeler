const extraKeywords = new Map();

export function getExtraKeyword(key) {
	return extraKeywords.has(key) ? extraKeywords.get(key) : false;
}

export function setExtraKeywords(keywords) {
	for (const [key, creater] of keywords) {
		extraKeywords.set(key, creater);
	}
}
