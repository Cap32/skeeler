import { registerKeywords } from './keywords';

const compilers = new Map();

const defaultCompile = (val) => val;

export function add(name, plugin = {}) {
	const { keywords, compile = defaultCompile } = plugin;

	if (keywords) {
		registerKeywords(name, keywords);
	}

	compilers.set(name, compile);
}

export function has(name) {
	return compilers.has(name);
}

export function getCompiler(name) {
	return compilers.get(name);
}
