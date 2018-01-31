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

	constructor(input = {}) {
		if (input instanceof Skeeler) {
			this.__chainTarget = input.__chainTarget;
			this.__spec = input.__spec;
			this.__modifiers = input.__modifiers;
		}
		else {
			this.__spec = input;
			this.__modifiers = new Map();
		}
	}

	_getArgumentsWithTarget(args) {
		return this.__chainTarget ? [this.__chainTarget, ...args] : args;
	}

	chain(target) {
		plugin.validateTarget(target);
		this.__chainTarget = target;
		return new Skeeler(this);
	}

	modify(...args) {
		const [target, modifier] = this._getArgumentsWithTarget(args);
		plugin.validateTarget(target);
		this.__modifiers.set(target, modifier);
		return this;
	}

	has(target) {
		return plugin.has(this.__chainTarget || target);
	}

	export(...args) {
		const [target, ...otherArgs] = this._getArgumentsWithTarget(args);
		plugin.validateTarget(target);

		const compile = plugin.getCompiler(target);

		/* istanbul ignore else */
		if (compile) {
			const modifier = this.__modifiers.get(target);
			const value = getValue(target, this.__spec, modifier);
			return compile(value, ...otherArgs);
		}
	}
}
