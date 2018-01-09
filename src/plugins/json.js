import traverse from 'traverse';
import createPlugin from '../createPlugin';

export default createPlugin(
	function toJson(properties) {
		const trav = traverse({ properties });
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
	},
);
