import getTypes from './getTypes';
import getValue from './getValue';
import * as plugin from './plugin';

export default class Skeeler {
	static use(keyOrPlugins, maybeValue) {
		if (typeof keyOrPlugins === 'string') {
			plugin.add(keyOrPlugins, maybeValue);
		} else {
			const plugins = keyOrPlugins;
			Object.keys(plugins).forEach(name => {
				plugin.add(name, plugins[name]);
			});
		}
		return Skeeler;
	}

	static getTypes = getTypes;

	constructor(spec = {}) {
		this._spec = spec;
	}

	has(name) {
		return plugin.has(name);
	}

	export(name, ...args) {
		if (!name) {
			throw new Error('name is required');
		}

		if (!plugin.has(name)) {
			throw new Error(`"${name}" is NOT defined`);
		}

		const compile = plugin.getCompiler(name);

		/* istanbul ignore else */
		if (compile) {
			const value = getValue(name, this._spec);
			return compile(value, ...args);
		}
	}
}
