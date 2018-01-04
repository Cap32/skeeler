import types from '../src/types';

describe('types', function () {
	test('string', function () {
		expect(types.string).toEqual({ type: 'string' });
	});

	test('number', function () {
		expect(types.number).toEqual({ type: 'number' });
	});

	test('integer', function () {
		expect(types.integer).toEqual({ type: 'integer' });
	});

	test('boolean', function () {
		expect(types.boolean).toEqual({ type: 'boolean' });
	});

	test('array', function () {
		expect(types.array).toEqual({ type: 'array' });
	});

	test('null', function () {
		expect(types.null).toEqual({ type: 'null' });
	});

	test('object', function () {
		expect(types.object()).toEqual({ type: 'object', properties: {} });
	});

	test('object with props', function () {
		expect(types.object({ name: types.string }))
			.toEqual({ type: 'object', properties: { name: { type: 'string' } } });
	});

	test('multipleOf', function () {
		expect(types.multipleOf(3)).toEqual({ multipleOf: 3 });
	});

	test('chaining', function () {
		expect(types.number.multipleOf(3)).toEqual({ type: 'number', multipleOf: 3 });
	});
});
