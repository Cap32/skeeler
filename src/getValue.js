import getStacks from './getStacks';
import isType from './isType';
import { getKeywords } from './keywords';

export default function getValue(target, value) {
	const keywords = getKeywords(target);

	const traverse = function traverse(value) {
		if (isType(value)) {
			const stacks = getStacks(value);
			const context = { state: {} };
			stacks.forEach(({ key, args }) => {
				const fn = keywords.get(key);

				/* istanbul ignore else */
				if (fn) {
					context.key = key;
					context.args = args;
					context.target = target;
					fn(context, ...args.map(traverse));
				}
				else {
					console.warn(`keyword "${key}" not found in "${target}"`);
				}
			});
			return context.state;
		}

		if (Array.isArray(value)) {
			return value.map(traverse);
		}

		if (value && typeof value === 'object') {
			return Object.keys(value).reduce((acc, key) => {
				const val = value[key];
				acc[key] = traverse(val);
				return acc;
			}, {});
		}

		return value;
	};

	return traverse(value);
}
