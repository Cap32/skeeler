# skeeler

[![Build Status](https://travis-ci.org/Cap32/skeeler.svg?branch=master)](https://travis-ci.org/Cap32/skeeler)
[![Coverage Status](https://coveralls.io/repos/github/Cap32/skeeler/badge.svg?branch=master)](https://coveralls.io/github/Cap32/skeeler?branch=master)

[WIP] Writing schema magically

The name is somewhat of a poor choice, but it was available on [npm](https://www.npmjs.com/package/skeeler).

## Simple Example

```js
import Skeeler from 'skeeler';
import SkeelerJSONSchemaDraft6 from 'skeeler-json-schema-draft-6';
import SkeelerMongoose from 'skeeler-mongoose';

const types = Skeeler.use('json', new SkeelerJSONSchemaDraft6())
  .use('mongoose', new SkeelerMongoose())
  .getKeywords();

const mySkeeler = new Skeeler({
  foo: types.string.required.unique,
  bar: types.number.index.exclusiveMinimum(0),
  baz: types.objectId.required,
  qux: types.array(types.string),
});

const jsonSchema = mySkeeler.export('json');
const mongooseSchema = mySkeeler.export('mongoose');

export { jsonSchema, mongooseSchema };
```

### Equals to JSON Schema v6

```js
export const jsonSchema = {
  properties: {
    foo: {
      type: 'string',
    },
    bar: {
      type: 'number',
      exclusiveMinimum: 0,
    },
    baz: {},
    qux: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['foo', 'baz'],
};
```

### Equals to Mongoose Schema

```js
export const mongooseSchema = new Mongoose.Schema({
  foo: {
    type: String,
    required: true,
    unique: true,
  },
  bar: {
    type: Number,
    index: true,
  },
  baz: {
    type: Mongoose.Types.ObjectId,
    required: true,
  },
  qux: [
    {
      type: String,
    },
  ],
});
```

## Complex Example

```js
import Skeeler from 'skeeler';
import SkeelerJSONSchemaDraft6 from 'skeeler-json-schema-draft-6';
import SkeelerMongoose from 'skeeler-mongoose';

const types = Skeeler.use('json', new SkeelerJSONSchemaDraft6())
  .use('mongoose', new SkeelerMongoose())
  .getKeywords();

const mySkeeler = new Skeeler({
  foo: types.string.required.unique,
  bar: types.number.index,
  baz: types.objectId.required,
  qux: types.anyOf([
    types.object({
      quux: types.number.exclusiveMinimum(0),
      corge: types.string,
    }),
    types.string.enum(['grault', 'garply']),
    types.boolean,
  ]),
  waldo: types.anyOf([types.array(types.string), types.string]).default([]),
});

const jsonSchema = mySkeeler.export('json');

const mongooseSchema = mySkeeler.export('mongoose', { timestamps: true });
mongooseSchema.index({ foo: 'text', baz: 'text' });

export { jsonSchema, mongooseSchema };
```

## Related Projects

* [skeeler-json-schema-draft-6](https://github.com/Cap32/skeeler-json-schema-draft-6)

## License

MIT
