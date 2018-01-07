export default function makeTraversal(handle) {
	return function traversal(value) {
		if (!value) { return value; }

		if (Array.isArray(value)) {
			return value.map(traversal);
		}

		if (typeof value === 'object' && value !== null) {
			return Object.keys(value).reduce((obj, key) => {
				obj[key] = traversal(value[key]);
				return obj;
			}, {});
		}

		return handle(value);
	};
};
