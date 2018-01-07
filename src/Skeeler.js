import { __values, __isType } from './symbols';
import traverse from 'traverse';

const getRequireds = function getRequireds(spec) {
	const trav = traverse(spec);
	return trav.map(function (val) {
		if (this.key === 'required' &&
			this.parent &&
			this.parent.parent &&
			this.parent.parent.parent &&
			this.parent.parent.key === 'properties'
		) {
			this.remove();
			const required = trav.get('required') || [];
			required.push(this.parent.key);
			trav.set('required', required);
			this.parent.parent.parent.node.required = required;
		}
		else {
			if (val[__isType]) { this.update(val[__values]); }
		}
	});
};

export default class Skeeler {
	constructor(spec) {
		this._spec = spec;
	}

	toJson() {
		const json = getRequireds({ properties: this._spec });
		return json;
	}
}
