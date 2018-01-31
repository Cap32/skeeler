import Skeeler, { getTypes, isType } from './src';
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
			expect(isType(types.foo)).toBe(true);
			expect(isType(types.bar)).toBe(true);
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
			expect(isType(types.foo())).toBe(true);
		});

		test('type methods chaining', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(isType(types.foo().bar())).toBe(true);
		});

		test('type props chaining', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getTypes();
			expect(isType(types.foo.bar)).toBe(true);
		});

		test('mixing props and methods chaining', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
				baz() {},
				qux() {},
			});
			const types = getTypes();
			expect(isType(types.foo().bar.baz().qux)).toBe(true);
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
			const name = 'test';
			addPrivateKeywords(name, {
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
			addPrivateKeywords(name, {
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
			addPrivateKeywords(name, {
				foo(ctx, value = 'bar') {
					ctx.state.foo = value;
				},
			});
			const types = getTypes();
			expect(getValue(name, types.foo)).toEqual(getValue(name, types.foo()));
		});

		test('array should work', function () {
			const name = 'test';
			addPrivateKeywords(name, {
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
			addPrivateKeywords(name, {
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

		test('destructuring assignment should work', function () {
			const name = 'test';
			addPrivateKeywords(name, {
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
			expect(getValue(name, spec)).toEqual({
				a: { foo: 'foo', bar: 'bar' },
				b: { bar: 'bar' },
				c: { foo: 'quux', bar: 'corge', baz: 'baz' },
				d: { foo: 'foo', bar: 'bar', baz: 'baz' },
			});
		});
	});

	describe('plugin', function () {
		test('should add plugin work', function () {
			const name = 'test';
			plugin.add(name);
			const compiler = plugin.getCompiler(name);
			const value = 'foo';
			expect(plugin.has(name)).toBe(true);
			expect(compiler(value)).toBe(value);
		});

		test('should extend keywords', function () {
			const name = 'test';
			const keywords = {
				foo() {},
				bar() {},
			};
			plugin.add(name, { keywords, compile: () => {} });
			expect(Object.keys(getTypes())).toEqual(['foo', 'bar']);
		});

		test('should compiler work', function () {
			const name = 'test';
			const compile = jest.fn(() => {});
			plugin.add(name, { compile });
			expect(plugin.getCompiler(name)).toBe(compile);
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
			const name = 'test';
			addPublicKeywords({
				foo(ctx) {
					ctx.state.foo = 'baz';
				},
			});
			addPrivateKeywords(name, {
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

		test('should throw error if Skeeler.export without name', function () {
			const skeeler = new Skeeler();
			expect(() => skeeler.export()).toThrowError('name is required');
		});

		test('should throw error if Skeeler.export name not exists', function () {
			const skeeler = new Skeeler();
			expect(() => skeeler.export('foo')).toThrowError('"foo" is NOT defined');
		});

		test('should skeeler.has() work', function () {
			const name = 'test';
			Skeeler.use(name);
			const skeeler = new Skeeler();
			expect(skeeler.has(name)).toBe(true);
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
