
const typeList = [
	'string',
	'number',
	'integer',
	'boolean',
	'object',
	'array',
	'null',
	'any',
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
];

const createTypes = function createTypes(spec = {}) {
	return new Proxy(spec, {
		get(target, prop) {
			if (typeof target[prop] !== 'undefined') {
				return target[prop];
			}

			const proxy = createTypes(target);

			if (~typeList.indexOf(prop)) {
				if (prop === 'object') {
					return (properties = {}) => {
						proxy.type = 'object';
						proxy.properties = properties;
						return proxy;
					};
				}
				proxy.type = prop;
				return proxy;
			}
			else if (~boolList.indexOf(prop)) {
				proxy[prop] = true;
				return proxy;
			}
			else if (~methodsList.indexOf(prop)) {
				return (value) => {
					proxy[prop] = value;
					return proxy;
				};
			}
		},
	});
};

export default new Proxy({}, {
	get(target, prop) {
		const types = createTypes();
		return types[prop];
	},
});
