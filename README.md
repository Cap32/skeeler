# skeeler

[WIP] Extendable [JSON schema](http://json-schema.org/) defination.


## Usage

### Basic Example

```js
import Skeeler, { types } from 'skeeler';

export default new Skeeler({
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
      types.array.items(types.string),
      types.string,
    ])
    .default([]),
});
```


## License

MIT
