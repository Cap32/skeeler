import { __state } from './symbols';

export default function createState(typeObj) {
	return new Proxy(typeObj, {
		set(target, prop, value) {
			typeObj[__state][prop] = value;
			typeObj[prop] = value;
			return true;
		},
	});
}
