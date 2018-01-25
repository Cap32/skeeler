import json from './plugins/json';
import getValue from './getValue';

const plugins = new Map();

export default class Skeeler {
	static use(exts) {
		Object.keys(exts).forEach(key => {
			plugins.set(key, exts[key]);
		});
	}

	constructor(spec) {
		this.value = getValue(spec);
	}

	exports(type = 'json', ...args) {
		const compile = plugins.get(type);
		if (compile) {
			return compile(this.value, ...args);
		}
	}
}

Skeeler.use({ json });
