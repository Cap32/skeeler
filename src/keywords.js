const stores = new Map();
const keys = new Set();

export function getKeywords(name) {
	return stores.get(name);
}

export function getKeys() {
	return keys;
}

export function registerKeywords(name, keywords) {
	/* istanbul ignore else */
	if (keywords) {
		const keywordsMap = new Map();
		Object.keys(keywords).forEach(key => {
			const keyword = keywords[key];
			keywordsMap.set(key, keyword);
			keys.add(key);
		});
		stores.set(name, keywordsMap);
	}
}

export function clearKeywords() {
	stores.clear();
	keys.clear();
}
