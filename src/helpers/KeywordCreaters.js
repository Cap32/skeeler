export const type = function type(key) {
	this.type = key;
};

export const array = function array() {
	this.type = 'array';
	return function setArray(items) {
		if (items) { this.items = items; }
	};
};

export const object = function object() {
	this.type = 'object';
	return function setObject(properties) {
		if (properties) { this.properties = properties; }
	};
};

export const setTrue = function setTrue(key) {
	this[key] = true;
};

export const setter = function setter(key) {
	return function setterFunc(value) {
		this[key] = value;
	};
};

export const func = function func() {
	this.instanceof = 'Function';
};
