const TypeExtensions = new Map();

export function getTypeExtensions() {
	return TypeExtensions;
}

export function extendType(newType = {}) {
	if (newType.key) {
		TypeExtensions.set(newType.key, newType);
	}
}
