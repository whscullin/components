function getImportMap(file) {
  const map = {}
  file.path.node.body
    .filter(path => {
      return path.type === 'ImportDeclaration'
    })
    .forEach(path => {
      path.specifiers.forEach(spec => {
        map[spec.local.name] = {
          // If there is no imported node, then we can assume that it is a
          // default import.
          name: spec.imported ? spec.imported.name : 'default',

          // Imports must have paths, so we don't need to test here.
          path: path.source.value,
        }
      })
    })
  return map
}

function getExportMap(file) {
  const map = {}
  file.path.node.body
    .filter(path => {
      return (
        path.type === 'ExportDefaultDeclaration' ||
        path.type === 'ExportNamedDeclaration'
      )
    })
    .forEach(path => {
      // Default exports have a declaration but no specifiers.
      // Named exports have no declaration but have specifiers.
      // Exports may or may not have paths.
      if (path.declaration) {
        map[path.declaration.name] = {
          name: 'default',
          path: path.source ? path.source.value : null,
        }
      } else if (path.specifiers) {
        path.specifiers.forEach(spec => {
          map[spec.exported.name] = {
            name: spec.local.name,
            path: path.source ? path.source.value : null,
          }
        })
      }
    })
  return map
}

function getImportToExportMap(file) {
  const importMap = getImportMap(file)
  const exportMap = getExportMap(file)

  return Object.keys(exportMap)
    .map(key => ({
      // All this mapping does is map import to export names along with
      // the corresponding file they come from.
      importName: exportMap[key].name,
      exportName: key,

      // Since exports may or may not have paths, we fallback to trying to
      // take a path from a corresponding import. If that import doesn't
      // have a path, the default extraction algorithm takes over.
      importPath:
        exportMap[key].path || (importMap[key] ? importMap[key].path : null),
    }))
    .filter(map => map.importPath)
}

module.exports.getExportMap = getExportMap
module.exports.getImportMap = getImportMap
module.exports.getImportToExportMap = getImportToExportMap
