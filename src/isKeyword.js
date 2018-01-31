import { __stacks } from './symbols';

export default function isType(val) {
	return !!val && !!val[__stacks];
}
