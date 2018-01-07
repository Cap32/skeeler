import { __values, __isType } from './symbols';

export default function getValue(value) {
	if (!value) { return value; }

	if (Array.isArray(value)) {
		return value.map(getValue);
	}

	if (typeof value === 'object' && value !== null) {
		return Object.keys(value).reduce((obj, key) => {
			obj[key] = getValue(value[key]);
			return obj;
		}, {});
	}

	return value[__isType] ? value[__values] : value;
};
