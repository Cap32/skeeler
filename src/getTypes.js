import { __stacks } from './symbols';
import { getKeys } from './keywords';

export default function getTypes() {
	const keys = getKeys();
	const createTypeX = function createTypeX(typeX = {}, value = []) {
		const descriptors = {
			[__stacks]: { value },
		};

		const pushStacks = (stack) => (typeX[__stacks] || []).concat(stack);

		keys.forEach((key) => {
			descriptors[key] = {
				enumerable: true,
				get() {
					const typeFn = (...args) => {
						const newTypeX = {};
						createTypeX(newTypeX, pushStacks({ key, args }));
						return newTypeX;
					};
					createTypeX(typeFn, pushStacks({ key, args: [] }));
					return typeFn;
				},
			};
		});
		return Object.defineProperties(typeX, descriptors);
	};

	return createTypeX();
}
