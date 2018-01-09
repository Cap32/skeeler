import { __state, __values, __isType } from './symbols';
import getValue from './getValue';
import createState from './createState';
import { getTypeExtensions } from './TypeExtensions';

const typeList = [
	'string',
	'number',
	'integer',
	'boolean',
	'null',
	'any',
	'array',
	'object',
];

const boolList = [
	'required',
];

const methodsList = [
	'multipleOf',
	'maximum',
	'exclusiveMaximum',
	'minimum',
	'exclusiveMinimum',
	'maxLength',
	'minLength',
	'pattern',
	'additionalItems',
	'maxItems',
	'minItems',
	'uniqueItems',
	'contains',
	'maxProperties',
	'minProperties',
	'properties',
	'patternProperties',
	'additionalProperties',
	'propertyNames',
	'enum',
	'const',
	'type',
	'anyOf',
	'oneOf',
	'allOf',
	'not',

	'instanceof',
	'typeof',
];

const aliases = {
	func: { key: 'instanceof', value: 'Function' },
};

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

			if (aliases[prop]) {
				const alias = aliases[prop];
				state[alias.key] = alias.value;
				return state;
			}

			if (~typeList.indexOf(prop)) {
				state.type = prop;
				if (prop === 'object') {
					return (properties = {}) => {
						state.properties = properties;
						return state;
					};
				}
				else if (prop === 'array') {
					return (items) => {
						if (items) { state.items = items; }
						return state;
					};
				}
				return state;
			}
			else if (~boolList.indexOf(prop)) {
				state[prop] = true;
				return state;
			}
			else if (~methodsList.indexOf(prop)) {
				return (value) => {
					state[prop] = value;
					return state;
				};
			}
		},
	});
};

export default new Proxy({}, {
	get(target, prop) {
		const extensions = getTypeExtensions();
		const spec = Object.defineProperties({}, {
			[__values]: { get() { return getValue(this[__state]); } },
			[__state]: { value: {} },
			[__isType]: { value: true },
		});
		const types = createTypes(spec, extensions);
		return types[prop];
	},
});
