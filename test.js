import Skeeler, { getTypes, isKeyword } from './src';
import getStacks from './src/getStacks';
import getValue from './src/getValue';
import * as plugin from './src/plugin';
import {
	addPrivateKeywords,
	addPublicKeywords,
	clearKeywords,
} from './src/keywords';

describe('types', function () {
	afterEach(() => {
		clearKeywords();
	});

	describe('isKeyword', function () {
		test('getTypes() should return true', function () {
			const types = getTypes();
			expect(isKeyword(types)).toBe(true);
		});

		test('plain object should return false', function () {
			expect(isKeyword({})).toBe(false);
		});

		test('plain function should return false', function () {
			expect(isKeyword(() => {})).toBe(false);
		});
	});

	describe('keywords / types', function () {
		test('types props could be extended', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(Object.keys(types)).toEqual(['foo', 'bar']);
		});

		test('types props should be types', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(isKeyword(types.foo)).toBe(true);
			expect(isKeyword(types.bar)).toBe(true);
		});

		test('types props should be functions', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			const keys = Object.keys(types);
			expect(keys.every((key) => typeof types[key] === 'function')).toBe(true);
		});

		test('type methods should return types', function () {
			addPrivateKeywords('test', {
				foo() {},
			});
			const types = getTypes();
			expect(isKeyword(types.foo())).toBe(true);
		});

		test('type methods chaining', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(isKeyword(types.foo().bar())).toBe(true);
		});

		test('type props chaining', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(isKeyword(types.foo.bar)).toBe(true);
		});

		test('mixing props and methods chaining', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
				baz() {},
				qux() {},
			});
			const types = getTypes();
			expect(isKeyword(types.foo().bar.baz().qux)).toBe(true);
		});

		test('prop\'s keys shoule equal to method\'s keys', function () {
			addPrivateKeywords('test', {
				foo() {},
			});
			const types = getTypes();
			expect(Object.keys(types.foo)).toEqual(Object.keys(types.foo()));
		});
	});

	describe('stacks', function () {
		test('getStacks should work', function () {
			addPrivateKeywords('test', {
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
			addPrivateKeywords('test', {
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
			addPrivateKeywords('test', {
				foo() {},
			});
			const types = getTypes();
			expect(getStacks(types.foo)).toEqual(getStacks(types.foo()));
		});
	});

	describe('value', function () {
		test('getValue should work', function () {
			const target = 'test';
			addPrivateKeywords(target, {
				foo(ctx) {
					ctx.state.foo = 'baz';
				},
				bar(ctx) {
					ctx.state.bar = 'qux';
				},
			});
			const types = getTypes();
			expect(getValue(target, types.foo.bar)).toEqual({
				foo: 'baz',
				bar: 'qux',
			});
		});

		test('getValue should work with args', function () {
			const target = 'test';
			addPrivateKeywords(target, {
				foo(ctx, value) {
					ctx.state.foo = value;
				},
				bar(ctx, arg1, arg2) {
					ctx.state.bar = arg1;
					ctx.state.baz = arg2;
				},
			});
			const types = getTypes();
			expect(getValue(target, types.foo('qux').bar('quux', 'corge'))).toEqual({
				foo: 'qux',
				bar: 'quux',
				baz: 'corge',
			});
		});

		test('default value should work', function () {
			const target = 'test';
			addPrivateKeywords(target, {
				foo(ctx, value = 'bar') {
					ctx.state.foo = value;
				},
			});
			const types = getTypes();
			expect(getValue(target, types.foo)).toEqual(
				getValue(target, types.foo()),
			);
		});

		test('array should work', function () {
			const target = 'test';
			addPrivateKeywords(target, {
				foo(ctx, value) {
					ctx.state.foo = value;
				},
				bar(ctx, value = 'fork') {
					ctx.state.bar = value;
				},
			});

			const types = getTypes();
			const type = types.foo([types.bar('baz'), types.bar('qux')]);
			expect(getValue(target, type)).toEqual({
				foo: [{ bar: 'baz' }, { bar: 'qux' }],
			});
		});

		test('getValue nest should work', function () {
			const target = 'test';
			addPrivateKeywords(target, {
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
			expect(getValue(target, type)).toEqual({ foo: { bar: { baz: true } } });
		});

		test('destructuring assignment should work', function () {
			const target = 'test';
			addPrivateKeywords(target, {
				foo(ctx, value = 'foo') {
					ctx.state.foo = value;
				},
				bar(ctx, value = 'bar') {
					ctx.state.bar = value;
				},
				baz(ctx, value = 'baz') {
					ctx.state.baz = value;
				},
			});
			const { foo, bar, baz: { bar: { foo: qux } } } = getTypes();
			const spec = {
				a: foo.bar,
				b: bar,
				c: qux('quux').bar('corge'),
				d: qux,
			};
			expect(getValue(target, spec)).toEqual({
				a: { foo: 'foo', bar: 'bar' },
				b: { bar: 'bar' },
				c: { foo: 'quux', bar: 'corge', baz: 'baz' },
				d: { foo: 'foo', bar: 'bar', baz: 'baz' },
			});
		});
	});

	describe('keyword function', function () {
		test('keyword function should be called', function () {
			const foo = jest.fn();
			const target = 'test';
			addPrivateKeywords(target, { foo });
			getValue(target, getTypes().foo);
			expect(foo).toHaveBeenCalled();
		});

		test('context argument should work', function () {
			const foo = jest.fn();
			const target = 'test';
			addPrivateKeywords(target, { foo });
			getValue(target, getTypes().foo);
			expect(foo.mock.calls[0][0]).toEqual({
				target,
				key: 'foo',
				state: {},
				args: [],
			});
		});

		test('context argument should work with arguments', function () {
			const foo = jest.fn();
			const target = 'test';
			addPrivateKeywords(target, { foo });
			getValue(target, getTypes().foo('bar', 'baz'));
			expect(foo.mock.calls[0][0].args).toEqual(['bar', 'baz']);
		});
	});

	describe('plugin', function () {
		test('should add plugin work', function () {
			const target = 'test';
			plugin.add(target);
			const compiler = plugin.getCompiler(target);
			const value = 'foo';
			expect(plugin.has(target)).toBe(true);
			expect(compiler(value)).toBe(value);
		});

		test('should extend keywords', function () {
			const target = 'test';
			const keywords = {
				foo() {},
				bar() {},
			};
			plugin.add(target, { keywords, compile: () => {} });
			expect(Object.keys(getTypes())).toEqual(['foo', 'bar']);
		});

		test('should compiler work', function () {
			const target = 'test';
			const compile = jest.fn(() => {});
			plugin.add(target, { compile });
			expect(plugin.getCompiler(target)).toBe(compile);
		});
	});

	describe('public keywords', function () {
		test('addPublicKeywords(keywords) should work', function () {
			addPublicKeywords({
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(Object.keys(types)).toEqual(['foo', 'bar']);
		});

		test('publicKeywords should share to private targets', function () {
			const target = 'test';
			addPublicKeywords({
				foo(ctx) {
					ctx.state.foo = 'baz';
				},
			});
			addPrivateKeywords(target, {
				bar(ctx) {
					ctx.state.bar = 'qux';
				},
			});
			const types = getTypes();
			expect(getValue(target, types.foo.bar)).toEqual({
				foo: 'baz',
				bar: 'qux',
			});
		});
	});

	describe('Skeeler', function () {
		test('should has getKeywords function', function () {
			expect(Skeeler.getKeywords).toBe(getTypes);
		});

		test('getTypes is equal to getKeywords', function () {
			expect(Skeeler.getTypes).toBe(Skeeler.getKeywords);
		});

		test('should has addKeywords function', function () {
			expect(Skeeler.addKeywords).toBe(addPublicKeywords);
		});

		test('should throw error if Skeeler.export without target', function () {
			const skeeler = new Skeeler();
			expect(() => skeeler.export()).toThrowError('target is required');
		});

		test('should throw error if Skeeler.export target not exists', function () {
			const skeeler = new Skeeler();
			expect(() => skeeler.export('foo')).toThrowError('"foo" is NOT defined');
		});

		test('should skeeler.has() work', function () {
			const target = 'test';
			Skeeler.use(target);
			const skeeler = new Skeeler();
			expect(skeeler.has(target)).toBe(true);
		});

		test('add plugin by using Skeeler.use(plugins)', function () {
			const val = 'foo';
			const compile = jest.fn(() => val);
			Skeeler.use({ test: { compile } });
			const skeeler = new Skeeler();
			expect(skeeler.export('test')).toBe(val);
		});
	});
});
