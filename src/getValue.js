import { __values, __isType } from './symbols';
import isType from './helpers/isType';
import traverse from 'traverse';

export default function getValue(value) {
	return traverse(value).map(function (val) {
		if (isType(val)) {
			const finalVal = val[__values];
			Object.defineProperty(finalVal, __isType, { value: true });
			this.update(finalVal);
		}
	});
}
