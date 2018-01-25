import types from '../src/types';
import Skeeler from '../src/Skeeler';

describe('skeeler', function () {
	test('basic', function () {
		const skeeler = new Skeeler({
			foo: types.string,
		});

		expect(skeeler.exports()).toEqual({
			properties: { foo: { type: 'string' } },
		});
	});

	test('required', function () {
		const skeeler = new Skeeler({
			foo: types.string.required,
			bar: types.number,
			baz: types.boolean.required,
		});
		expect(skeeler.exports()).toEqual({
			properties: {
				foo: { type: 'string' },
				bar: { type: 'number' },
				baz: { type: 'boolean' },
			},
			required: ['foo', 'baz'],
		});
	});
});
