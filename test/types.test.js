import types from '../src/types';
import { __values } from '../src/symbols';

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

	test('null', function () {
		expect(types.null).toEqual({ type: 'null' });
	});

	test('array', function () {
		expect(types.array()).toEqual({ type: 'array', items: [] });
	});

	test('array with argument', function () {
		expect(types.array([ types.string ]))
			.toEqual({ type: 'array', items: [{ type: 'string' }] });
	});

	test('object', function () {
		expect(types.object()).toEqual({ type: 'object', properties: {} });
	});

	test('object with argument', function () {
		expect(types.object({ name: types.string }))
			.toEqual({ type: 'object', properties: { name: { type: 'string' } } });
	});

	test('multipleOf', function () {
		expect(types.multipleOf(3)).toEqual({ multipleOf: 3 });
	});

	test('chaining', function () {
		expect(types.number.multipleOf(3)).toEqual({ type: 'number', multipleOf: 3 });
	});

	test('typeof', function () {
		expect(types.typeof('function')).toEqual({ typeof: 'function' });
	});

	test('instanceof', function () {
		expect(types.instanceof('Foo')).toEqual({ instanceof: 'Foo' });
	});

	test('func', function () {
		expect(types.func).toEqual({ instanceof: 'Function' });
	});

	test('__values', function () {
		expect(types.string.required[__values])
			.toEqual({ type: 'string', required: true });
	});
});
