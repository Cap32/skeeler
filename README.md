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

export default mySkeeler;
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
  bar: types.string.mongoose({ index: true }),
});
mySkeeler.mongoose((config, MongooseSchema) => {
  const schema = new MongooseSchema(config, { timestamps: true });
  schema.index({ foo: 'text', bar: 'text' });
  return schema;
});

export default mySkeeler;
export const mySkeelerMongoose = mySkeeler.toObject('mongoose');
```


## License

MIT
