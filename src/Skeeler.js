import json from './plugins/json';
import getValue from './getValue';

const plugins = new Map();

export default class Skeeler {
	static extend(exts) {
		Object.keys(exts).forEach((key) => {
			plugins.set(key, exts[key]);
		});
	}

	constructor(spec) {
		this.value = getValue(spec);
	}

	exports(type = 'json', ...args) {
		const performExports = plugins.get(type);
		if (performExports) {
			return performExports(this.value, ...args);
		}
	}
}

Skeeler.extend({ json });
