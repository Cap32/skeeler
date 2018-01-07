
const TypeExtensions = new Map();

export function getTypeExtensions() {
	return TypeExtensions;
}

export function extendType(key, extension) {
	TypeExtensions.set(key, extension);
}
