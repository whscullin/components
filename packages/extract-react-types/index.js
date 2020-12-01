const createBabelFile = require('babel-file')
const fs = require('fs')
const pretty = require('./pretty')
const resolve = require('./resolve')
const { getImportToExportMap } = require('./mapping')
const { exportedComponents, getContext } = require('./legacy')

function extractReactTypes(code, typeSystem, filename, inputResolveOptions) {
  var context = getContext(typeSystem, filename, inputResolveOptions)
  var file = createBabelFile(code, {
    parserOpts: context.parserOpts,
    filename: filename,
  })

  let exported = []

  // We can only attept to trace if we're given a valid path to a file.
  // Otherwise we assume legacy behavior.
  if (resolve(filename)) {
    const mapping = getImportToExportMap(file)

    mapping.forEach(map => {
      const importPath = resolve(map.importPath, filename)

      // We assume that if we're given a filename, we should trace imports.
      // TODO: consider attaching an option to toggle this behavior.
      if (!importPath) {
        throw new Error(
          `Cannot resolve dependcy ${importPath} from ${filename}`
        )
      }

      exported = exported.concat(
        extractFromFile(importPath).map(e => {
          // If there's no name, it means it's a default export that's been
          // extracted. We can figure out this name by looking up the default
          // import name for the file we're extracting from.
          if (!e.name) {
            e.name = mapping.find(
              m => m.importName === 'default' && m.importPath === map.importPath
            ).exportName
          }
          return e
        })
      )
    })
  }

  exported = exported.concat(exportedComponents(file.path, 'all', context))

  return exported
}

function extractFromCode(code, file) {
  return extractReactTypes(code, 'typescript', file)
}

function extractFromFile(file) {
  const resolved = resolve(file)
  if (!resolved) {
    throw new Error(`Cannot resolve: ${file}`)
  }
  return extractFromCode(fs.readFileSync(resolved).toString('utf8'), resolved)
}

exports.extractFromCode = extractFromCode
exports.extractFromFile = extractFromFile
exports.extractReactTypes = extractReactTypes
exports.pretty = pretty
exports.resolve = resolve
