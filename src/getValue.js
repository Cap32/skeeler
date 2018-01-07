import { __values, __isType } from './symbols';
import traverse from 'traverse';

export default function getValue(value) {
	return traverse(value).map(function (val) {
		if (val[__isType]) { this.update(val[__values]); }
	});
}
