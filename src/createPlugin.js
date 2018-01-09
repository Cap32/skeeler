import { extendType } from './TypeExtensions';

export default function createPlugin(toObject, extendTypes) {
	if (extendTypes) { extendTypes(extendType); }
	return toObject;
}
