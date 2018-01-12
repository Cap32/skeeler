# skeeler

[WIP] Extendable [JSON schema](http://json-schema.org/) defination.


## Usage

### Basic Example

```js
import Skeeler, { types } from 'skeeler';

const mySkeeler = new Skeeler({
  foo: types.string.required,
  bar: types.number,
  baz: types.required,
  qux: types.anyOf([
    types.object({
      quux: types.number.exclusiveMinimum(0),
      corge: types.string,
    }),
    types.string.enum(['grault', 'garply']),
    types.boolean,
  ]),
  waldo: types
    .anyOf([
      types.array(types.string),
      types.string,
    ])
    .default([]),
});

const jsonSchema = mySkeeler.exports();

export { jsonSchema };
```

### With Plugins

```js
import Skeeler, { types } from 'skeeler';
import SkeelerMongoosePlugin from 'skeeler-mongoose-plugin';

Skeeler.extend({
  mongoose: new SkeelerMongoosePlugin(),
});

const mySkeeler = new Skeeler({
  foo: types.string.required,
  bar: types.objectId.index(true),
  baz: types.string.unique,
});

const jsonSchema = mySkeeler.exports();

const mongooseSchema = mySkeeler.exports('mongoose', { timestamps: true });
mongooseSchema.index({ foo: 'text', baz: 'text' });

export { jsonSchema, mongooseSchema };
```


## License

MIT
