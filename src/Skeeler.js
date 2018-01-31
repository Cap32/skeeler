import getTypes from './getTypes';
import getValue from './getValue';
import * as plugin from './plugin';
import { addPublicKeywords } from './keywords';

export default class Skeeler {
	static use(keyOrPlugins, maybeValue) {
		if (typeof keyOrPlugins === 'string') {
			plugin.add(keyOrPlugins, maybeValue);
		}
		else {
			const plugins = keyOrPlugins;
			Object.keys(plugins).forEach((target) => {
				plugin.add(target, plugins[target]);
			});
		}
		return Skeeler;
	}

	static addKeywords = addPublicKeywords;

	static getTypes = getTypes;
	static getKeywords = getTypes;

	constructor(spec = {}) {
		this._spec = spec;
	}

	has(target) {
		return plugin.has(target);
	}

	export(target, ...args) {
		if (!target) {
			throw new Error('target is required');
		}

		if (!plugin.has(target)) {
			throw new Error(`"${target}" is NOT defined`);
		}

		const compile = plugin.getCompiler(target);

		/* istanbul ignore else */
		if (compile) {
			const value = getValue(target, this._spec);
			return compile(value, ...args);
		}
	}
}
