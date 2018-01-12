import { __isType } from '../symbols';

export default function isType(val) {
	return !!val && val[__isType];
}
