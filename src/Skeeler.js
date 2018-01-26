import getTypes from './getTypes';
import getValue from './getValue';

const plugins = new Map();

export default class Skeeler {
	static use(exts) {
		Object.keys(exts).forEach(key => {
			plugins.set(key, exts[key]);
		});
	}

	static getTypes = getTypes;

	constructor(spec) {
		this._spec = spec;
	}

	export(name, ...args) {
		if (!plugins.has(name)) {
			throw new Error(`"${name}" is NOT defined`);
		}

		const compile = plugins.get(name);
		if (compile) {
			const value = getValue(name, this._spec);
			return compile(value, ...args);
		}
	}
}
