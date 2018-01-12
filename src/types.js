import { __state, __values, __isType } from './symbols';
import getValue from './getValue';
import createState from './createState';
import Keywords from './Keywords';
import { getExtraKeywords } from './helpers/ExtraKeywords';

const createTypes = function createTypes(spec = {}, extensions) {
	return new Proxy(spec, {
		get(target, prop) {
			if (typeof target[prop] !== 'undefined') {
				return target[prop];
			}

			const state = createState(createTypes(target, extensions));

			if (extensions.has(prop)) {
				const value = extensions.get(prop);
				if (typeof value === 'function') {
					return value(state, prop);
				}

				state[prop] = value;
				return state;
			}

			const setKeyword = Keywords[prop];
			if (typeof setKeyword === 'function') {
				const setterFunc = setKeyword.call(state, prop);
				if (typeof setterFunc === 'function') {
					return function setterProxy(value) {
						setterFunc.call(state, value);
						return state;
					};
				}
				else {
					return state;
				}
			}
		},
	});
};

export default new Proxy({}, {
	get(target, prop) {
		const extensions = getExtraKeywords();
		const spec = Object.defineProperties({}, {
			[__values]: { get() { return getValue(this[__state]); } },
			[__state]: { value: {} },
			[__isType]: { value: true },
		});
		const types = createTypes(spec, extensions);
		return types[prop];
	},
});
