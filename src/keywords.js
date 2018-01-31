const privateKeywords = new Map();
const publicKeywords = new Map();
const keys = new Set();

export function getPrivateKeywords(target) {
	return privateKeywords.get(target);
}

export function getPublicKeywords() {
	return publicKeywords;
}

export function getKeys() {
	return keys;
}

export function addPrivateKeywords(target, keywords) {
	/* istanbul ignore else */
	if (keywords) {
		const keywordsMap = new Map();
		Object.keys(keywords).forEach((key) => {
			const keyword = keywords[key];
			keywordsMap.set(key, keyword);
			keys.add(key);
		});
		privateKeywords.set(target, keywordsMap);
	}
}

export function addPublicKeywords(keywords) {
	/* istanbul ignore else */
	if (keywords) {
		Object.keys(keywords).forEach((key) => {
			const keyword = keywords[key];
			publicKeywords.set(key, keyword);
			keys.add(key);
		});
	}
}

export function clearKeywords() {
	privateKeywords.clear();
	keys.clear();
}
