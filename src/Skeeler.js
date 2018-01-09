import jsonPlugin from './jsonPlugin';
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

	toObject(type = 'json') {
		const toObject = plugins.get(type);
		if (toObject) {
			return toObject(this.value);
		}
	}
}

Skeeler.extend({ json: jsonPlugin });
