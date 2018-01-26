import { __stacks } from './symbols';
import isType from './isType';

export default function getStacks(type) {
	return isType(type) && type[__stacks];
}
