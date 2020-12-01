const path = require('path')
const resolve = require('resolve')

module.exports = function(file, relativeTo) {
  return resolve.sync(file, {
    basedir: relativeTo ? path.dirname(relativeTo) : process.cwd(),
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  })
}
