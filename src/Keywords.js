import {
	type, array, object, setTrue, setter, func,
} from './helpers/KeywordCreaters';

export default {
	string: type,
	number: type,
	integer: type,
	boolean: type,
	null: type,
	any: type,
	array,
	object,

	required: setTrue,

	multipleOf: setter,
	maximum: setter,
	exclusiveMaximum: setter,
	minimum: setter,
	exclusiveMinimum: setter,
	maxLength: setter,
	minLength: setter,
	pattern: setter,
	additionalItems: setter,
	maxItems: setter,
	minItems: setter,
	uniqueItems: setter,
	contains: setter,
	maxProperties: setter,
	minProperties: setter,
	properties: setter,
	patternProperties: setter,
	additionalProperties: setter,
	propertyNames: setter,
	enum: setter,
	const: setter,
	type: setter,
	anyOf: setter,
	oneOf: setter,
	allOf: setter,
	not: setter,

	instanceof: setter,
	typeof: setter,

	func,
};
