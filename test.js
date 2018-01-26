import { getTypes, isType } from './src';
import { registerKeywords, clearKeywords } from './src/keywords';
import getStacks from './src/getStacks';
import getValue from './src/getValue';

describe('types', function () {
	afterEach(() => {
		clearKeywords();
	});

	describe('isType', function () {
		test('getTypes() should return true', function () {
			const types = getTypes();
			expect(isType(types)).toBe(true);
		});

		test('plain object should return false', function () {
			expect(isType({})).toBe(false);
		});

		test('plain function should return false', function () {
			expect(isType(() => {})).toBe(false);
		});
	});

	describe('types', function () {
		test('types props could be extended', function () {
			registerKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(Object.keys(types)).toEqual(['foo', 'bar']);
		});

		test('types props should be types', function () {
			registerKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(isType(types.foo)).toBe(true);
			expect(isType(types.bar)).toBe(true);
		});

		test('types props should be functions', function () {
			registerKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			const keys = Object.keys(types);
			expect(keys.every(key => typeof types[key] === 'function')).toBe(true);
		});

		test('type methods should return types', function () {
			registerKeywords('test', {
				foo() {},
			});
			const types = getTypes();
			expect(isType(types.foo())).toBe(true);
		});

		test('type methods chaining', function () {
			registerKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(isType(types.foo().bar())).toBe(true);
		});

		test('type props chaining', function () {
			registerKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(isType(types.foo.bar)).toBe(true);
		});

		test('mixing props and methods chaining', function () {
			registerKeywords('test', {
				foo() {},
				bar() {},
				baz() {},
				qux() {},
			});
			const types = getTypes();
			expect(isType(types.foo().bar.baz().qux)).toBe(true);
		});

		test('prop\'s keys shoule equal to method\'s keys', function () {
			registerKeywords('test', {
				foo() {},
			});
			const types = getTypes();
			expect(Object.keys(types.foo)).toEqual(Object.keys(types.foo()));
		});
	});

	describe('stacks', function () {
		test('getStacks should work', function () {
			registerKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(getStacks(types.foo.bar)).toEqual([
				{ key: 'foo', args: [] },
				{ key: 'bar', args: [] },
			]);
		});

		test('getStacks should work with args', function () {
			registerKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(getStacks(types.foo('baz').bar('qux'))).toEqual([
				{ key: 'foo', args: ['baz'] },
				{ key: 'bar', args: ['qux'] },
			]);
		});

		test('prop\'s stacks shoule equal to method\'s stacks', function () {
			registerKeywords('test', {
				foo() {},
			});
			const types = getTypes();
			expect(getStacks(types.foo)).toEqual(getStacks(types.foo()));
		});
	});

	describe('value', function () {
		test('getValue should work', function () {
			const name = 'test';
			registerKeywords(name, {
				foo(ctx) {
					ctx.state.foo = 'baz';
				},
				bar(ctx) {
					ctx.state.bar = 'qux';
				},
			});
			const types = getTypes();
			expect(getValue(name, types.foo.bar)).toEqual({
				foo: 'baz',
				bar: 'qux',
			});
		});

		test('getValue should work with args', function () {
			const name = 'test';
			registerKeywords(name, {
				foo(ctx, value) {
					ctx.state.foo = value;
				},
				bar(ctx, arg1, arg2) {
					ctx.state.bar = arg1;
					ctx.state.baz = arg2;
				},
			});
			const types = getTypes();
			expect(getValue(name, types.foo('qux').bar('quux', 'corge'))).toEqual({
				foo: 'qux',
				bar: 'quux',
				baz: 'corge',
			});
		});

		test('default value should work', function () {
			const name = 'test';
			registerKeywords(name, {
				foo(ctx, value = 'bar') {
					ctx.state.foo = value;
				},
			});
			const types = getTypes();
			expect(getValue(name, types.foo)).toEqual(getValue(name, types.foo()));
		});

		test('array should work', function () {
			const name = 'test';
			registerKeywords(name, {
				foo(ctx, value) {
					ctx.state.foo = value;
				},
				bar(ctx, value = 'fork') {
					ctx.state.bar = value;
				},
			});

			const types = getTypes();
			const type = types.foo([types.bar('baz'), types.bar('qux')]);
			expect(getValue(name, type)).toEqual({
				foo: [{ bar: 'baz' }, { bar: 'qux' }],
			});
		});

		test('getValue nest should work', function () {
			const name = 'test';
			registerKeywords(name, {
				foo(ctx, value) {
					ctx.state.foo = value;
				},
				bar(ctx, value) {
					ctx.state.bar = value;
				},
				baz(ctx) {
					ctx.state.baz = true;
				},
			});
			const types = getTypes();
			const type = types.foo(types.bar(types.baz));
			expect(getValue(name, type)).toEqual({ foo: { bar: { baz: true } } });
		});
	});
});
