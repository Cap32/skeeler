const extraKeywords = {};

export function getExtraKeyword(key) {
	return extraKeywords[key];
}

export function setExtraKeywords(keywords) {
	Object.keys(keywords).forEach(key => {
		extraKeywords[key] = keywords[key];
	});
}
