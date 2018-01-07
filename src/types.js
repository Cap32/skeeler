
import { __state, __values } from './symbols';

const typeList = [
	'string',
	'number',
	'integer',
	'boolean',
	'array',
	'null',
	'any',

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
	'items',
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

const createTypes = function createTypes(spec = {}) {
	return new Proxy(spec, {
		get(target, prop) {
			if (typeof target[prop] !== 'undefined') {
				return target[prop];
			}

			const proxy = createTypes(target);

			const setState = function setState(key, value) {
				proxy[__state][key] = value;
				proxy[key] = value;
			};

			if (aliases[prop]) {
				const alias = aliases[prop];
				setState(alias.key, alias.value);
				return proxy;
			}

			if (~typeList.indexOf(prop)) {
				if (prop === 'object') {
					return (properties = {}) => {
						setState('type', 'object');
						setState('properties', properties);
						return proxy;
					};
				}
				setState('type', prop);
				return proxy;
			}
			else if (~boolList.indexOf(prop)) {
				setState(prop, true);
				return proxy;
			}
			else if (~methodsList.indexOf(prop)) {
				return (value) => {
					setState(prop, value);
					return proxy;
				};
			}
		},
	});
};

export default new Proxy({}, {
	get(target, prop) {
		const types = createTypes(Object.defineProperties({}, {
			[__values]: {
				get() {
					return this[__state];
				},
			},
			[__state]: {
				value: {},
			},
		}));
		return types[prop];
	},
});
