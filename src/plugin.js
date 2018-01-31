import { addPrivateKeywords } from './keywords';

const compilers = new Map();

const defaultCompile = (val) => val;

export function add(target, plugin = {}) {
	const { keywords, compile = defaultCompile } = plugin;

	if (keywords) {
		addPrivateKeywords(target, keywords);
	}

	compilers.set(target, compile);
}

export function has(target) {
	return compilers.has(target);
}

export function getCompiler(target) {
	return compilers.get(target);
}

export function validateTarget(target) {
	if (!target) {
		throw new Error('"target" is required');
	}

	if (!has(target)) {
		throw new Error(`"${target}" is NOT defined`);
	}
}
