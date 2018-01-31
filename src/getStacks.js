import { __stacks } from './symbols';
import isKeyword from './isKeyword';

export default function getStacks(type) {
	return isKeyword(type) && type[__stacks];
}
