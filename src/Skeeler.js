import traverse from 'traverse';
import getValue from './getValue';

const toJson = function toJson(spec) {
	const trav = traverse(spec);
	return trav.map(function () {
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
	});
};

export default class Skeeler {
	constructor(spec) {
		this.value = getValue(spec);
	}

	toObject(type = 'json') {
		if (type === 'json') { return toJson({ properties: this.value }); }
	}
}
