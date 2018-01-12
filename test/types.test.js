import types from '../src/types';
import { __values } from '../src/symbols';

describe('setting types', function () {
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
		expect(types.array()).toEqual({ type: 'array' });
	});

	test('array with argument', function () {
		expect(types.array(types.string))
			.toEqual({ type: 'array', items: { type: 'string' } });
	});

	test('object', function () {
		expect(types.object()).toEqual({ type: 'object' });
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
});

describe('getting types values', function () {
	test('typeof __values should be object', function () {
		expect(typeof types.string.required[__values]).toBe('object');
	});

	test('values should be plain json', function () {
		const json = types.string.required[__values];
		expect(json).toEqual({ type: 'string', required: true });
		expect(typeof json[__values]).toBe('undefined');
	});

	test('array', function () {
		const json = types.array(types.string)[__values];
		expect(json).toEqual({ type: 'array', items: { type: 'string' } });
		expect(typeof json.items[__values]).toBe('undefined');
	});

	test('object', function () {
		const json = types.object({ foo: types.string })[__values];
		expect(json).toEqual({ type: 'object', properties: { foo: { type: 'string' } } });
		expect(typeof json.properties.foo[__values]).toBe('undefined');
	});
});
