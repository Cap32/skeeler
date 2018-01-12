import { extendType } from './TypeExtensions';

export default function createPlugin(options = {}) {
	const { newTypes, toExport } = options;
	if (newTypes) { newTypes.forEach(extendType); }
	return toExport;
}
