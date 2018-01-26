export const type = function type(ctx) {
	ctx.state.type = ctx.key;
};

export const array = function array(ctx, items) {
	ctx.state.type = 'array';
	if (Array.isArray(items)) {
		ctx.state.items = items;
	}
};

export const object = function object(ctx, properties) {
	ctx.state.type = 'object';
	if (typeof properties === 'object') {
		ctx.state.properties = properties;
	}
};

export const setTrue = function setTrue(ctx, val = true) {
	ctx.state[ctx.key] = val;
};

export const setter = function setter(ctx, val) {
	ctx.state[ctx.key] = val;
};

export const func = function func(ctx) {
	ctx.state.instanceof = 'Function';
};
