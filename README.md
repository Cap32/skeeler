# skeeler

[![Build Status](https://travis-ci.org/Cap32/skeeler.svg?branch=master)](https://travis-ci.org/Cap32/skeeler)

[WIP] Define schema magically

## Simple Example

```js
import Skeeler, { types } from 'skeeler';
import SkeelerJSONSchemaV6 from 'skeeler-json-schema-v6-plugin';
import SkeelerMongoose from 'skeeler-mongoose-plugin';

Skeeler.use({
  json: new SkeelerJSONSchemaV6(),
  mongoose: new SkeelerMongoose(),
});

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
import Skeeler, { types } from 'skeeler';
import SkeelerJSONSchemaV6 from 'skeeler-json-schema-v6-plugin';
import SkeelerMongoose from 'skeeler-mongoose-plugin';

Skeeler.use({
  json: new SkeelerJSONSchemaV6(),
  mongoose: new SkeelerMongoose(),
});

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

## License

MIT
