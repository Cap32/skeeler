import getStacks from './getStacks';
import isType from './isType';
import { getPublicKeywords, getPrivateKeywords } from './keywords';

const $removed = Symbol('removed');

export default function getValue(target, value, modifier) {
	if (modifier && modifier.hasOwnProperty('/') && modifier['/'] === undefined) {
		return undefined;
	}

	const privateKeywords = getPrivateKeywords(target);
	const publicKeywords = getPublicKeywords();

	const getKeywords = function getKeywords(key) {
		return privateKeywords.get(key) || publicKeywords.get(key);
	};

	const handledPointers = new Set();

	const traverse = function traverse(value, pointer) {
		if (!pointer || pointer === '/') {
			pointer = '';
		}

		if (
			modifier &&
			modifier.hasOwnProperty(pointer) &&
			!handledPointers.has(pointer)
		) {
			handledPointers.add(pointer);
			value = modifier[pointer];
			if (value === undefined) {
				value = $removed;
				return $removed;
			}
		}

		const pushPointer = function pushPointer(leafPointer) {
			return `${pointer}/${leafPointer}`;
		};

		if (isType(value)) {
			const stacks = getStacks(value);
			const context = { state: {} };
			stacks.forEach(({ key, args }) => {
				const fn = getKeywords(key);

				/* istanbul ignore else */
				if (fn) {
					context.key = key;
					context.args = args;
					context.target = target;
					context.pointer = pointer || '/';
					fn(context, ...args.map((arg) => traverse(arg, pushPointer(key))));
				}
				else {
					console.warn(`keyword "${key}" not found in "${target}"`);
				}
			});

			const { state } = context;
			Object.keys(state).forEach((key) => {
				if (state[key] === $removed) {
					delete state[key];
				}
			});
			return state;
		}

		if (Array.isArray(value)) {
			return value
				.map((item, index) => traverse(item, pushPointer(index)))
				.filter((item) => item !== $removed);
		}

		if (value && typeof value === 'object') {
			return Object.keys(value).reduce((acc, key) => {
				const val = value[key];
				const final = traverse(val, pushPointer(key));
				if (final !== $removed) {
					acc[key] = final;
				}
				return acc;
			}, {});
		}

		return value;
	};

	return traverse(value);
}
