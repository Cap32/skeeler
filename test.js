import Skeeler, { getKeywords, isType } from './src';
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
		test('getKeywords() should return true', function () {
			const types = getKeywords();
			expect(isType(types)).toBe(true);
		});

		test('plain object should return false', function () {
			expect(isType({})).toBe(false);
		});

		test('plain function should return false', function () {
			expect(isType(() => {})).toBe(false);
		});
	});

	describe('keywords / types', function () {
		test('types props could be extended', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getKeywords();
			expect(Object.keys(types)).toEqual(['foo', 'bar']);
		});

		test('types props should be types', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getKeywords();
			expect(isType(types.foo)).toBe(true);
			expect(isType(types.bar)).toBe(true);
		});

		test('types props should be functions', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getKeywords();
			const keys = Object.keys(types);
			expect(keys.every((key) => typeof types[key] === 'function')).toBe(true);
		});

		test('type methods should return types', function () {
			addPrivateKeywords('test', {
				foo() {},
			});
			const types = getKeywords();
			expect(isType(types.foo())).toBe(true);
		});

		test('type methods chaining', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getKeywords();
			expect(isType(types.foo().bar())).toBe(true);
		});

		test('type props chaining', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getKeywords();
			expect(isType(types.foo.bar)).toBe(true);
		});

		test('mixing props and methods chaining', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
				baz() {},
				qux() {},
			});
			const types = getKeywords();
			expect(isType(types.foo().bar.baz().qux)).toBe(true);
		});

		test('prop\'s keys shoule equal to method\'s keys', function () {
			addPrivateKeywords('test', {
				foo() {},
			});
			const types = getKeywords();
			expect(Object.keys(types.foo)).toEqual(Object.keys(types.foo()));
		});
	});

	describe('stacks', function () {
		test('getStacks should work', function () {
			addPrivateKeywords('test', {
				foo() {},
				bar() {},
			});
			const types = getKeywords();
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
			const types = getKeywords();
			expect(getStacks(types.foo('baz').bar('qux'))).toEqual([
				{ key: 'foo', args: ['baz'] },
				{ key: 'bar', args: ['qux'] },
			]);
		});

		test('prop\'s stacks shoule equal to method\'s stacks', function () {
			addPrivateKeywords('test', {
				foo() {},
			});
			const types = getKeywords();
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
			const types = getKeywords();
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
			const types = getKeywords();
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
			const types = getKeywords();
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

			const types = getKeywords();
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
			const types = getKeywords();
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
			const { foo, bar, baz: { bar: { foo: qux } } } = getKeywords();
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
			getValue(target, getKeywords().foo);
			expect(foo).toHaveBeenCalled();
		});

		test('context argument should work', function () {
			const foo = jest.fn();
			const target = 'test';
			addPrivateKeywords(target, { foo });
			getValue(target, getKeywords().foo);
			expect(foo.mock.calls[0][0]).toEqual({
				target,
				key: 'foo',
				state: {},
				args: [],
				pointer: '/',
			});
		});

		test('context arguments should work ', function () {
			const foo = jest.fn();
			const target = 'test';
			addPrivateKeywords(target, { foo });
			getValue(target, getKeywords().foo('bar', 'baz'));
			expect(foo.mock.calls[0][0].args).toEqual(['bar', 'baz']);
		});

		test('context pointer should work', function () {
			const keywordFunc = (ctx, arg) => {
				ctx.state[ctx.key] = arg;
			};
			const foo = jest.fn(keywordFunc);
			const bar = jest.fn(keywordFunc);
			const baz = jest.fn(keywordFunc);
			const qux = jest.fn(keywordFunc);
			const target = 'test';
			addPrivateKeywords(target, { foo, bar, baz, qux });
			const types = getKeywords();
			const spec = {
				a: types.foo,
				b: types.bar([
					types.baz({
						c: types.qux,
					}),
				]),
			};
			getValue(target, spec);
			expect(foo.mock.calls[0][0].pointer).toBe('/a');
			expect(bar.mock.calls[0][0].pointer).toBe('/b');
			expect(baz.mock.calls[0][0].pointer).toBe('/b/bar/0');
			expect(qux.mock.calls[0][0].pointer).toBe('/b/bar/0/baz/c');
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
			expect(Object.keys(getKeywords())).toEqual(['foo', 'bar']);
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
			const types = getKeywords();
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
			const types = getKeywords();
			expect(getValue(target, types.foo.bar)).toEqual({
				foo: 'baz',
				bar: 'qux',
			});
		});
	});

	describe('Skeeler', function () {
		test('should has getKeywords function', function () {
			expect(Skeeler.getKeywords).toBe(getKeywords);
		});

		test('getTypes is equal to getKeywords', function () {
			expect(Skeeler.getTypes).toBe(Skeeler.getKeywords);
		});

		test('Skeeler.addKeywords(keywords) should work', function () {
			Skeeler.addKeywords({
				foo() {},
				bar() {},
			});
			const types = getKeywords();
			expect(Object.keys(types)).toEqual(['foo', 'bar']);
		});

		test('should throw error if Skeeler.export without target', function () {
			const skeeler = new Skeeler();
			expect(() => skeeler.export()).toThrowError('"target" is required');
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
			const compile = () => val;
			Skeeler.use({ test: { compile } });
			const skeeler = new Skeeler();
			expect(skeeler.export('test')).toBe(val);
		});

		test('should chaining work', function () {
			const target = 'test';
			Skeeler.use(target);
			const skeeler = new Skeeler();
			const res = skeeler
				.chain(target)
				.modify()
				.export();
			expect(res).toEqual({});
		});
	});

	describe('modify', function () {
		test('modify should work', function () {
			const target = 'test';
			const types = Skeeler.use(target, {
				keywords: {
					foo(ctx, arg) {
						ctx.state.foo = arg;
					},
				},
			}).getKeywords();
			const skeeler = new Skeeler({ a: types.foo('bar') });
			skeeler.modify(target, { '/a': types.foo('qux') });
			expect(skeeler.export(target)).toEqual({ a: { foo: 'qux' } });
		});

		test('modify with deep pointer should work', function () {
			const target = 'test';
			const keywordFunc = (ctx, arg) => {
				ctx.state[ctx.key] = arg;
			};
			const types = Skeeler.use(target, {
				keywords: {
					foo: keywordFunc,
					bar: keywordFunc,
					baz: keywordFunc,
				},
			}).getKeywords();
			const skeeler = new Skeeler({
				a: types.foo({
					b: types.bar([types.baz('qux')]),
					c: types.foo('corge'),
					d: types.foo('grault'),
				}),
			});
			skeeler.modify(target, {
				'/a/foo/b/bar/0': types.baz('quux'),
				'/a/foo/d': types.bar('garply'),
			});
			expect(skeeler.export(target)).toEqual({
				a: {
					foo: {
						b: {
							bar: [
								{
									baz: 'quux',
								},
							],
						},
						c: {
							foo: 'corge',
						},
						d: {
							bar: 'garply',
						},
					},
				},
			});
		});

		test('modify should remove `undefined` keys', function () {
			const target = 'test';
			const types = Skeeler.use(target, {
				keywords: {
					foo(ctx, arg) {
						ctx.state.foo = arg;
					},
				},
			}).getKeywords();
			const skeeler = new Skeeler({
				a: types.foo('foo'),
				b: types.foo([types.foo('bar'), types.foo('baz')]),
				c: types.foo('qux'),
			});
			skeeler.modify(target, {
				'/a': undefined,
				'/b/foo/1': undefined,
				'/c/foo': undefined,
			});
			const res = skeeler.export(target);
			expect(res.hasOwnProperty('a')).toBe(false);
			expect(res.b.foo.hasOwnProperty('1')).toBe(false);
			expect(res.c.hasOwnProperty('foo')).toBe(false);
		});

		test('modify should return `undefined` if "/" is `undefined`', function () {
			const target = 'test';
			const skeeler = new Skeeler({
				a: 'foo',
			});
			skeeler.modify(target, {
				'/': undefined,
			});
			expect(skeeler.export(target)).toBe(undefined);
		});
	});
});
