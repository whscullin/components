# extract-react-types

> Extract TypeScript-based prop type information from your React Components.

_This package is currently an extension of https://github.com/atlassian/extract-react-types because it doesn't have enough functionality required to work with entry points and dependency graphs longer than the entry itself, and it normally requires transpilation to work even in Node, which creates an additional barrier to work with it. This private package retains the [license](./license) from the original project. The plan is to eventually push the changes back to the project._

## Features

- Extracts complete information about React prop types written in TypeScript.
- Supports functional components and class components alike.
- If given a file path, it traces the entire dependency graph for types.
- Legacy APIs have support for Flow, and are noted.

## Usage

```sh
$ yarn add extract-react-types
```

Say you have the following component:

```tsx
// Component.tsx

interface ComponentProps {
  // Some description about `children`.
  children?: React.ReactNode
}

export default function Component(props: ComponentProps) {
  return <div>{props.children}</div>
}
```

To extract its types, all you need to do is:

```js
const { extractFromFile } = require('extract-react-types')

const types = extractFromFile('./Component.tsx')

console.log(types)
```

This would output:

```json
[
  {
    "name": "Component",
    "component": {
      "props": [
        {
          "description": "Some description about `children`.",
          "name": "children",
          "required": false
        }
      ]
    }
  }
]
```

## API

The public API exports 3 methods:

- `extractFromFile`
- `extractFromCode`
- `extractReactTypes` - legacy API and still supports flow. It's output is more raw than the other extraction methods. This is to retain backward compatibility.

### extractFromFile

> Extracts type information from an entry point.

The common use case for using `extractFromFile` is to get the types of all the components that are exported by a given entry point. Because you've given it a file path, it can resolve dependencies down the tree linking the exports in the entry point to types defined anywhere in the dependency graph.

This means that things like the following work as intended:

```tsx
import something from 'file'

export default something
export const another = something
export { default } from './another/file'
export { default as something } from 'another/file'
```

Even exports that aren't given a name, such as some of the `default` exports, will still be given a name because that is traced back to the name they're given when they're exported. This doesn't matter at runtime, but when your displaying information about a particular component, it becomes useful. A given file's `default` export is always called "default".

You then use it like:

```js
const { extractFromFile } = require('extract-react-types')

extractFromFile('./my-entry.ts')
```

### extractFromCode

> Extracts type information from a code snippet.

The `extractFromCode` function behaves like `extractFromFile` (`extractFromFile` uses `extractFromCode internally), except that it does not walk the dependency graph unless you provide the`file` argument.

```js
const { extractFromCode } = require('extract-react-types')

const file = './my-entry.ts'
const code = `
  import something from 'file'

  export default something
  export const another = something
  export { default } from './another/file'
  export { default as something } from 'another/file'
`

// This would not walk the dependency graph.
extractFromFile(code)

// This would, thus behaves just like extractFromCode.
extractFromCode(code, file)
```

### extractReactTypes

> Extracts raw type information from exported components defined in a given code block.

The `extractReactTypes` function is used internally by the rest of the API. However, what it returns is in a more raw form and currently retains support for Flow.

```js
const { extractReactTypes } = require('extract-react-types')

const code = `
  import something from 'file'

  export default something
  export const another = something
  export { default } from './another/file'
  export { default as something } from 'another/file'
`
const typeSystem = 'typescript'
const filename = './my-entry.ts'
const inputResolveOptions = {}

extractReactTypes(code, typeSystem, filename, inputResolveOptions)
```

The call to `extractReactTypes` above would output the following:

```json
{
  "kind": "program",
  "classes": [
    {
      "kind": "object",
      "members": [
        {
          "kind": "property",
          "key": {
            "kind": "id",
            "name": "children"
          },
          "value": {
            "kind": "React.ReactNode"
          },
          "optional": true
        }
      ],
      "name": {
        "kind": "id",
        "name": "Component",
        "type": null
      }
    }
  ]
}
```

## Related projects:

- [pretty-proptypes](https://github.com/atlassian/extract-react-types/tree/master/packages/pretty-proptypes)
- [babel-plugin-extract-react-types](https://github.com/atlassian/extract-react-types/tree/master/packages/babel-plugin-extract-react-types)
- [extract-react-types-loader](https://github.com/atlassian/extract-react-types/tree/master/packages/extract-react-types-loader)
