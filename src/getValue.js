import { __values } from './symbols';
import isType from './isType';
import traverse from 'traverse';

export default function getValue(value) {
	return traverse(value).map(function (val) {
		if (isType(val)) { this.update(val[__values]); }
	});
}
