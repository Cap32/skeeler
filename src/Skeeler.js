import getKeywords from './getKeywords';
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

	static addKeywords(keywords) {
		addPublicKeywords(keywords);
		return Skeeler;
	}

	static getTypes = getKeywords;
	static getKeywords = getKeywords;

	constructor(spec = {}) {
		this._spec = spec;
		this._modifiers = new Map();
	}

	modify(target, modifier) {
		plugin.validateTarget(target);
		this._modifiers.set(target, modifier);
		return this;
	}

	has(target) {
		return plugin.has(target);
	}

	export(target, ...args) {
		plugin.validateTarget(target);

		const compile = plugin.getCompiler(target);

		/* istanbul ignore else */
		if (compile) {
			const modifier = this._modifiers.get(target);
			const value = getValue(target, this._spec, modifier);
			return compile(value, ...args);
		}
	}
}
