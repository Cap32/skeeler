import { __values, __isType } from './symbols';
import makeTraversal from './makeTraversal';

export default makeTraversal(function traversalGetValue(value) {
	return value[__isType] ? value[__values] : value;
});
