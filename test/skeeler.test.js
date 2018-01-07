import types from '../src/types';
import Skeeler from '../src/Skeeler';

describe('skeeler', function () {
	test('basic', function () {
		const skeeler = new Skeeler({
			foo: types.string,
		});
		expect(skeeler.toJson()).toEqual({ foo: { type: 'string' } });
	});
});
