'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex.default : ex
}

var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'))
var _objectWithoutProperties = _interopDefault(
  require('@babel/runtime/helpers/objectWithoutProperties')
)
var _objectSpread = _interopDefault(
  require('@babel/runtime/helpers/objectSpread')
)
var nodePath = _interopDefault(require('path'))
var babelFileLoader = require('babel-file-loader')
var babelFlowIdentifiers = require('babel-flow-identifiers')
var babelTypeScopes = require('babel-type-scopes')
var babelIdentifiers = require('babel-identifiers')
var babelReactComponents = require('babel-react-components')
var createBabylonOptions = _interopDefault(require('babylon-options'))
var t = require('@babel/types')
var babelNormalizeComments = require('babel-normalize-comments')
var resolve = require('resolve')
var babelExplodeModule = require('@aparna036/babel-explode-module')
var babelHelperSimplifyModule = require('babel-helper-simplify-module')
var printAST = _interopDefault(require('ast-pretty-print'))

function matchExported(file, exportName) {
  var exploded = babelExplodeModule.explodeModule(file.path.node)
  var statements = babelHelperSimplifyModule.explodedToStatements(exploded)
  var program = Object.assign({}, file.path.node, {
    body: statements,
  })
  file.path.replaceWith(program)
  var match = exploded.exports.find(function(item) {
    return item.external === exportName
  })

  if (!match) {
    return null
  }

  var local = match.local

  if (!local) {
    return null
  }

  if (local === 'default' && match.source) {
    local = exportName
  }

  var statement = file.path.get('body').find(function(item) {
    // Ignore export all & default declarations, since they do not have specifiers/ids.
    if (!item.isDeclaration() || item.isExportAllDeclaration()) return false
    var id = null

    if (item.isVariableDeclaration()) {
      id = item.node.declarations[0].id
    } else if (item.isImportDeclaration()) {
      id = item.node.specifiers[0].local
    } else if (item.isExportNamedDeclaration()) {
      id = item.node.specifiers[0].exported
    } else if (item.node.id) {
      id = item.node.id
    } else {
      throw new Error('Unexpected node:\n\n'.concat(printAST(item)))
    }

    if (!id) {
      throw new Error("Couldn't find id on node:\n\n".concat(printAST(item)))
    }

    return id.name === local
  })
  return statement || null
}

function hasDestructuredDefaultExport(path) {
  var exportPath = path.get('body').find(function(bodyPath) {
    return (
      bodyPath.isExportNamedDeclaration() &&
      bodyPath.get('specifiers').filter(function(n) {
        return n.node.exported.name === 'default'
      }).length
    )
  })
  return Boolean(exportPath)
}
function followExports(path, context, convert) {
  var exportPath = path.get('body').find(function(bodyPath) {
    return (
      bodyPath.isExportNamedDeclaration() &&
      bodyPath.get('specifiers').filter(function(n) {
        return n.node.exported.name === 'default'
      })
    )
  })
  if (!exportPath)
    throw new Error({
      message: 'No export path found',
    })

  try {
    var filePath = babelFileLoader.resolveImportFilePathSync(
      exportPath,
      context.resolveOptions
    )
    var file = babelFileLoader.loadFileSync(filePath, context.parserOpts)
    var converted = convert(file.path, context)
    return converted
  } catch (e) {
    throw new Error(e)
  }
}
function findExports(path, exportsToFind) {
  var formattedExports = []
  path
    .get('body')
    .filter(function(bodyPath) {
      return (
        // we only check for named and default exports here, we don't want export all
        exportsToFind === 'default'
          ? bodyPath.isExportDefaultDeclaration()
          : (bodyPath.isExportNamedDeclaration() &&
            bodyPath.node.source === null && // exportKind is 'value' or 'type' in flow
              (bodyPath.node.exportKind === 'value' || // exportKind is undefined in typescript
                bodyPath.node.exportKind === undefined)) ||
              bodyPath.isExportDefaultDeclaration()
      )
    })
    .forEach(function(exportPath) {
      var declaration = exportPath.get('declaration')

      if (exportPath.isExportDefaultDeclaration()) {
        if (declaration.isIdentifier()) {
          var binding = path.scope.bindings[declaration.node.name].path

          if (binding.isVariableDeclarator()) {
            binding = binding.get('init')
          }

          formattedExports.push({
            name: declaration.node.name,
            path: binding,
          })
        } else {
          var name = null

          if (
            (declaration.isClassDeclaration() ||
              declaration.isFunctionDeclaration()) &&
            declaration.node.id !== null
          ) {
            name = declaration.node.id.name
          }

          formattedExports.push({
            name: name,
            path: declaration,
          })
        }
      } else {
        var specifiers = exportPath.get('specifiers')

        if (specifiers.length === 0) {
          if (
            declaration.isFunctionDeclaration() ||
            declaration.isClassDeclaration()
          ) {
            var identifier = declaration.node.id
            formattedExports.push({
              name: identifier === null ? null : identifier.name,
              path: declaration,
            })
          }

          if (declaration.isVariableDeclaration()) {
            declaration.get('declarations').forEach(function(declarator) {
              formattedExports.push({
                name: declarator.node.id.name,
                path: declarator.get('init'),
              })
            })
          }
        } else {
          specifiers.forEach(function(specifier) {
            var name = specifier.node.local.name
            var binding = path.scope.bindings[name].path

            if (binding.isVariableDeclarator()) {
              binding = binding.get('init')
            }

            formattedExports.push({
              name: name,
              path: binding,
            })
          })
        }
      }
    })
  return formattedExports
}

var converters = {}

function convertObject(path, context) {
  var members = []
  path.get('properties').forEach(function(p) {
    var mem = convert(p, context)

    if (mem.kind === 'spread') {
      var memVal = resolveFromGeneric(mem.value)

      if (memVal.kind === 'initial' && memVal.value.kind === 'object') {
        members = members.concat(memVal.value.members)
      } else if (memVal.kind === 'object') {
        members = members.concat(memVal.members)
      } else if (memVal.kind === 'variable') {
        var declarations = memVal.declarations
        declarations = declarations[declarations.length - 1].value

        if (declarations.kind !== 'object') {
          throw new Error('Trying to spread a non-object item onto an object')
        } else {
          members = members.concat(declarations.members)
        }
      } else if (memVal.kind === 'import') {
        // We are explicitly calling out we are handling the import kind
        members = members.concat(mem)
      } else {
        // This is a fallback
        members = members.concat(mem)
      }
    } else if (mem.kind === 'property') {
      members.push(mem)
    }
  })
  return {
    kind: 'object',
    members: members,
  }
}

function resolveExportAllDeclaration(path, context) {
  var source = path.get('source') // The parentPath is a reference to where we currently are. We want to
  // get the source value, but resolving this first makes this easier.

  var filePath = babelFileLoader.resolveImportFilePathSync(
    source.parentPath,
    context.resolveOptions
  )
  return babelFileLoader.loadFileSync(filePath, context.parserOpts)
} // Converts utility types to a simpler representation

function convertUtilityTypes(type) {
  var result = _objectSpread({}, type)

  if (type.value.name === '$Exact') {
    // $Exact<T> can simply be converted to T
    if (
      type.typeParams &&
      type.typeParams.params &&
      type.typeParams.params[0]
    ) {
      result = type.typeParams.params[0]
    } else {
      /* eslint-disable-next-line no-console */
      console.warn('Missing type parameter for $Exact type')
    }
  }

  return result
}

function convertReactComponentClass(path, context) {
  var params = []
  try {
    params = path.get('superTypeParameters').get('params')
  } catch (e) {}
  var props = params[0]
  var defaultProps = getDefaultProps(path, context)
  var classProperties = props
    ? convert(
        props,
        _objectSpread({}, context, {
          mode: 'type',
        })
      )
    : {}
  classProperties.name = convert(
    path.get('id'),
    _objectSpread({}, context, {
      mode: 'value',
    })
  )
  /**
   * FIXME: It's possible to get nulls in the members array when TS is unable
   * to resolve type definitions of non-relative module imports
   * See: https://github.com/atlassian/extract-react-types/issues/89
   **/

  if (classProperties.value && classProperties.value.members) {
    classProperties.value.members = classProperties.value.members.filter(
      function(m) {
        return !!m
      }
    )
  }

  return addDefaultProps(classProperties, defaultProps)
}

function convertReactComponentFunction(path, context) {
  // we have a function, assume the props are the first parameter
  var propType = path.get('params.0')
  if (!propType) {
    return
  }
  propType = propType.get('typeAnnotation')
  var functionProperties = convert(
    propType,
    _objectSpread({}, context, {
      mode: 'type',
    })
  )
  var name = ''

  if (
    path.type === 'FunctionDeclaration' &&
    path.node.id &&
    path.node.id.name
  ) {
    name = path.node.id.name
  } else {
    var variableDeclarator = path.findParent(function(scopedPath) {
      return scopedPath.isVariableDeclarator()
    })

    if (variableDeclarator) {
      name = variableDeclarator.node.id.name
    }
  }

  var defaultProps = []

  if (name) {
    path.hub.file.path.traverse({
      // look for MyComponent.defaultProps = ...
      AssignmentExpression: function AssignmentExpression(assignmentPath) {
        var left = assignmentPath.get('left.object')

        if (left.isIdentifier() && left.node.name === name) {
          var initialConversion = convert(
            assignmentPath.get('right'),
            _objectSpread({}, context, {
              mode: 'value',
            })
          )
          defaultProps = initialConversion.members
        }
      },
    })
    functionProperties.name = {
      kind: 'id',
      name: name,
      type: null,
    }
  }

  return addDefaultProps(functionProperties, defaultProps)
}

function addDefaultProps(props, defaultProps) {
  if (!defaultProps) {
    return props
  }

  defaultProps.forEach(function(property) {
    var ungeneric = resolveFromGeneric(props)
    var prop = getProp(ungeneric, property)

    if (!prop) {
      /* eslint-disable-next-line no-console */
      console.warn(
        'Could not find property to go with default of '
          .concat(
            property.key.value ? property.key.value : property.key.name,
            ' in '
          )
          .concat(props.name, ' prop types')
      )
      return
    }

    prop.default = property.value
  })
  return props
}

function convertCall(path, context) {
  var callee = convert(path.get('callee'), context)
  var args = path.get('arguments').map(function(a) {
    return convert(a, context)
  })
  return {
    callee: callee,
    args: args,
  }
}

function recursivelyResolveExportAll(path, context, name) {
  var source = path
    .get('body')
    .filter(function(item) {
      return item.isExportAllDeclaration()
    })
    .map(function(item) {
      return resolveExportAllDeclaration(item, context)
    })
    .filter(Boolean)
  var matchedDeclartion = source.reduce(function(acc, current) {
    if (acc) {
      return acc
    }

    return matchExported(current, name)
  }, null)

  if (matchedDeclartion) {
    return matchedDeclartion
  }

  return source.reduce(function(acc, current) {
    if (acc) {
      return acc
    }

    return recursivelyResolveExportAll(current.path, context, name)
  }, null)
}

var isSpecialReactComponentType = function isSpecialReactComponentType(
  path,
  type
) {
  if (path && path.isCallExpression()) {
    var callee = path.get('callee')

    if (callee.isIdentifier() && callee.node.name === type) {
      return true
    }

    if (
      callee.isMemberExpression() &&
      callee.matchesPattern('React.'.concat(type))
    ) {
      return true
    }
  }

  return false
}

var getPropFromObject = function getPropFromObject(props, property) {
  var prop

  if (!props.members) {
    throw new Error(
      'Attempted to get property from non-object kind: '
        .concat(props.kind, '. Full object: ')
        .concat(JSON.stringify(props))
    )
  }

  props.members.forEach(function(p) {
    if (p.kind === 'spread') {
      var spreadArg = resolveFromGeneric(p.value)
      if (!spreadArg || spreadArg.kind !== 'object') return
      var p2 = getPropFromObject(spreadArg, property)
      if (p2) prop = p2 // The kind of the object member must be the same as the kind of the property
    } else if (property.key.kind === 'id' && p.key.name === property.key.name) {
      prop = p
    } else if (
      property.key.kind === 'string' &&
      p.key.value === property.key.value
    ) {
      prop = p
    }
  })
  return prop
}

var resolveFromGeneric = function resolveFromGeneric(type) {
  if (type.kind !== 'generic') return type
  return resolveFromGeneric(type.value)
}

var getProp = function getProp(props, property) {
  var prop

  if (props.kind === 'intersection') {
    props.types.forEach(function(pr) {
      prop = getProp(resolveFromGeneric(pr), property) || prop
    })
  } else if (props.kind === 'object') {
    prop = getPropFromObject(props, property)
  }

  return prop
}

var isVariableOfMembers = function isVariableOfMembers(defaultProps) {
  var defaultPropsIsVar =
    defaultProps && defaultProps.value && defaultProps.value.kind === 'variable'

  if (!defaultPropsIsVar) {
    return false
  }

  var declarations = defaultProps.value.declarations
  var lastDeclarationIsObject =
    declarations[declarations.length - 1].value.kind === 'object'

  if (lastDeclarationIsObject) {
    return true
  } else {
    return false
  }
}

var getDefaultProps = function getDefaultProps(path, context) {
  var defaultProps = null
  var foundDefaults = path
    .get('body')
    .get('body')
    .find(function(p) {
      return (
        p.isClassProperty() &&
        p.get('key').isIdentifier({
          name: 'defaultProps',
        })
      )
    })

  if (foundDefaults) {
    defaultProps = convert(
      foundDefaults,
      _objectSpread({}, context, {
        mode: 'value',
      })
    )
  }

  if (!defaultProps) {
    return []
  } else if (
    defaultProps &&
    defaultProps.value &&
    defaultProps.value.kind === 'object'
  ) {
    return defaultProps.value.members
  } else if (isVariableOfMembers(defaultProps)) {
    const index = defaultProps.value.declarations.length - 1
    return defaultProps.value.declarations[index].value.members
  } else {
    throw new Error('Could not resolve default Props, '.concat(defaultProps))
  }
}

function isTsIdentifier(path) {
  if (
    ['TSExpressionWithTypeArguments', 'TSTypeReference'].indexOf(
      path.parentPath.type
    ) !== -1 &&
    babelIdentifiers.getIdentifierKind(path) === 'reference'
  ) {
    return true
  }

  return false
}

function convertParameter(param, context) {
  const _convert = convert(param, context)
  const type = _convert.type
  const rest = _objectWithoutProperties(_convert, ['type'])

  return {
    kind: 'param',
    value: rest,
    type: type || null,
  }
}

function convertFunction(path, context) {
  var parameters = path.get('params').map(function(p) {
    return convertParameter(p, context)
  })
  var returnType = null
  var id = null

  if (path.node.returnType) {
    returnType = convert(path.get('returnType'), context)
  }

  if (path.node.id) {
    id = convert(path.get('id'), context)
  }

  return {
    kind: 'function',
    id: id,
    async: path.node.async,
    generator: path.node.generator,
    parameters: parameters,
    returnType: returnType,
  }
} // This is the entry point. Program will only be found once.

converters.Program = function(path, context) {
  // coerce whether or not we need to follow an export to a new File and Program
  // only do so on export { default } from 'x';
  // followExports(path, context, convert);
  if (hasDestructuredDefaultExport(path)) {
    return followExports(path, context, convert)
  } else {
    var components = exportedComponents(path, 'default', context) // components[0] could be undefined

    var component

    if (components[0]) {
      component = components[0].component
    } // just extract the props from the first class in the file

    if (!component) {
      path.traverse({
        ClassDeclaration: function ClassDeclaration(scopedPath) {
          if (
            !component &&
            babelReactComponents.isReactComponentClass(scopedPath)
          ) {
            component = convertReactComponentClass(scopedPath, context)
          }
        },
      })
    }

    return {
      kind: 'program',
      component: component,
    }
  }
}

converters.TaggedTemplateExpression = function(path, context) {
  return {
    kind: 'templateExpression',
    tag: convert(path.get('tag'), context),
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.TemplateElement = function(path, context) {
  return {
    kind: 'templateElement',
    value: path.node.value,
  }
}

converters.TemplateLiteral = function(path, context) {
  // hard challenge, we need to know the combined ordering of expressions and quasis
  return {
    kind: 'templateLiteral',
    expressions: path.get('expressions').map(function(e) {
      return convert(e, context)
    }),
    quasis: path.get('quasis').map(function(q) {
      return convert(q, context)
    }),
  }
}

converters.LogicalExpression = function(path, context) {
  return {
    kind: 'logicalExpression',
    operator: path.node.operator,
    left: convert(path.get('left'), context),
    right: convert(path.get('right'), context),
  }
}

converters.RestElement = function(path, context) {
  return {
    kind: 'rest',
    argument: convert(path.get('argument'), context),
  }
}

converters.AssignmentPattern = function(path, context) {
  return {
    kind: 'assignmentPattern',
    left: convert(path.get('left'), context),
    right: convert(path.get('right'), context),
  }
}

converters.ObjectPattern = function(path, context) {
  var members = []
  var _iteratorNormalCompletion = true
  var _didIteratorError = false
  var _iteratorError

  try {
    for (
      var _iterator = path.get('properties')[Symbol.iterator](), _step;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true
    ) {
      var property = _step.value
      members.push(convert(property, context))
    }
  } catch (err) {
    _didIteratorError = true
    _iteratorError = err
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return()
      }
    } finally {
      if (_didIteratorError) {
        // eslint-disable-next-line
        throw _iteratorError
      }
    }
  }

  return {
    kind: 'objectPattern',
    members: members,
  }
}

converters.ClassDeclaration = function(path, context) {
  if (!babelReactComponents.isReactComponentClass(path)) {
    return {
      kind: 'class',
      name: convert(path.get('id'), context),
    }
  } else {
    return convertReactComponentClass(path, context)
  }
}

converters.SpreadElement = function(path, context) {
  return {
    kind: 'spread',
    value: convert(path.get('argument'), context),
  }
} // This has been renamed to SpreadElement in babel 7. Added here for backwards
// compatibility in other projects

converters.SpreadProperty = function(path, context) {
  return {
    kind: 'spread',
    value: convert(path.get('argument'), context),
  }
}

converters.UnaryExpression = function(path, context) {
  return {
    kind: 'unary',
    operator: path.node.operator,
    argument: convert(path.get('argument'), context),
  }
}

converters.JSXAttribute = function(path, context) {
  return {
    kind: 'JSXAttribute',
    name: convert(path.get('name'), context),
    value: convert(path.get('value'), context),
  }
}

converters.JSXExpressionContainer = function(path, context) {
  return {
    kind: 'JSXExpressionContainer',
    expression: convert(path.get('expression'), context),
  }
}

converters.JSXElement = function(path, context) {
  return {
    kind: 'JSXElement',
    value: convert(path.get('openingElement'), context),
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.JSXIdentifier = function(path, context) {
  return {
    kind: 'JSXIdentifier',
    value: path.node.name,
  }
}

converters.JSXMemberExpression = function(path, context) {
  return {
    kind: 'JSXMemberExpression',
    object: convert(path.get('object'), context),
    property: convert(path.get('property'), context),
  }
}

converters.JSXOpeningElement = function(path, context) {
  return {
    kind: 'JSXOpeningElement',
    name: convert(path.get('name'), context),
    attributes: path.get('attributes').map(function(item) {
      return convert(item, context)
    }),
  }
}

converters.ClassProperty = function(path, context) {
  return {
    kind: 'property',
    key: convert(path.get('key'), context),
    value: convert(path.get('value'), context),
  }
}

converters.CallExpression = function(path, context) {
  const _convertCall = convertCall(path, context)
  const callee = _convertCall.callee
  const args = _convertCall.args

  return {
    kind: 'call',
    callee: callee,
    args: args,
  }
}

converters.NewExpression = function(path, context) {
  const _convertCall2 = convertCall(path, context)
  const callee = _convertCall2.callee
  const args = _convertCall2.args

  return {
    kind: 'new',
    callee: callee,
    args: args,
  }
}

converters.InterfaceDeclaration = function(path, context) {
  return {
    kind: 'interfaceDeclaration',
    id: convert(path.get('id'), context),
  }
}

converters.OpaqueType = function(path, context) {
  // OpaqueTypes have several optional nodes that exist as a null when not present
  // We need to convert these when they exist, and ignore them when they don't;
  var supertypePath = path.get('supertype')
  var impltypePath = path.get('impltype')
  var typeParametersPath = path.get('typeParameters') // TODO we are having a fight at the moment with id returning a binding, not a node,
  // and don't have time to solve this properly - I am pathing it to being working-ish
  // here, and will come back to this later. If you find this comment still here and
  // want to fix this problem, I encourage you to do is.

  var supertype
  var impltype
  var typeParameters
  var id = convert(path.get('id'), context)
  if (supertypePath.node) supertype = convert(supertypePath, context)
  if (impltypePath.node) impltype = convert(impltypePath, context)
  if (typeParametersPath.node)
    typeParameters = convert(typeParametersPath, context)
  return {
    kind: 'opaqueType',
    id: id,
    supertype: supertype,
    impltype: impltype,
    typeParameters: typeParameters,
  }
}

converters.TypeofTypeAnnotation = function(path, context) {
  var type = convert(
    path.get('argument'),
    _objectSpread({}, context, {
      mode: 'value',
    })
  )
  var ungeneric = resolveFromGeneric(type)
  return {
    kind: 'typeof',
    type: type,
    name: ungeneric.name || ungeneric.referenceIdName,
  }
}

converters.ObjectProperty = function(path, context) {
  return {
    kind: 'property',
    key: convert(path.get('key'), context),
    value: convert(path.get('value'), context),
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.ExistentialTypeParam = function(path, context) {
  return {
    kind: 'exists',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.StringLiteral = function(path, context) {
  return {
    kind: 'string',
    value: path.node.value,
  }
}

converters.TypeCastExpression = function(path, context) {
  return {
    kind: 'typeCastExpression',
    expression: convert(path.get('expression'), context),
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.NumericLiteral = function(path, context) {
  return {
    kind: 'number',
    value: path.node.value,
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.NullLiteral = function(path, context) {
  return {
    kind: 'null',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.BooleanLiteral = function(path, context) {
  return {
    kind: 'boolean',
    value: path.node.value,
  }
}

converters.ArrayExpression = function(path, context) {
  return {
    kind: 'array',
    elements: path.get('elements').map(function(e) {
      return convert(e, context)
    }),
  }
}

converters.BinaryExpression = function(path, context) {
  return {
    kind: 'binary',
    operator: path.node.operator,
    left: convert(path.get('left'), context),
    right: convert(path.get('right'), context),
  }
}

converters.MemberExpression = function(path, context) {
  return {
    kind: 'memberExpression',
    object: convert(path.get('object'), context),
    property: convert(path.get('property'), context),
  }
}

converters.FunctionDeclaration = function(path, context) {
  return convertFunction(path, context)
}

converters.ArrowFunctionExpression = function(path, context) {
  return convertFunction(path, context)
}

converters.FunctionExpression = function(path, context) {
  return convertFunction(path, context)
}

converters.TypeAnnotation = function(path, context) {
  return convert(path.get('typeAnnotation'), context)
}
/* eslint-disable-next-line no-unused-vars */

converters.ExistsTypeAnnotation = function(path, context) {
  return {
    kind: 'exists',
  }
}

converters.ObjectTypeAnnotation = function(path, context) {
  return convertObject(path, context)
}

converters.ObjectTypeProperty = function(path, context) {
  var result = {}
  result.kind = 'property'
  result.key = convert(path.get('key'), context)
  result.value = convert(path.get('value'), context)
  result.optional = path.node.optional
  return result
}

converters.UnionTypeAnnotation = function(path, context) {
  var types = path.get('types').map(function(p) {
    return convert(p, context)
  })
  return {
    kind: 'union',
    types: types,
  }
}

converters.TypeParameterInstantiation = function(path, context) {
  return {
    kind: 'typeParams',
    params: path.get('params').map(function(p) {
      return convert(p, context)
    }),
  }
}

converters.TypeParameterDeclaration = function(path, context) {
  return {
    kind: 'typeParamsDeclaration',
    params: path.get('params').map(function(p) {
      return convert(p, context)
    }),
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.TypeParameter = function(path, context) {
  return {
    kind: 'typeParam',
    name: path.node.name,
  }
}

converters.GenericTypeAnnotation = function(path, context) {
  var result = {}
  result.kind = 'generic'
  result.value = convert(path.get('id'), context)

  if (path.node.typeParameters) {
    result.typeParams = convert(path.get('typeParameters'), context)
  }

  if (result.value.kind === 'id') {
    result = convertUtilityTypes(result)
  }

  return result
}

converters.ObjectMethod = function(path, context) {
  var parameters = path.get('params').map(function(p) {
    return convertParameter(p, context)
  })
  var returnType = null

  if (path.node.returnType) {
    returnType = convert(path.get('returnType'), context)
  }

  return {
    kind: 'function',
    id: null,
    async: path.node.async,
    generator: path.node.generator,
    parameters: parameters,
    returnType: returnType,
  }
}

converters.ObjectExpression = function(path, context) {
  return convertObject(path, context)
}

converters.VariableDeclaration = function(path, context) {
  var res = {}
  res.kind = 'variable'
  res.declarations = path.get('declarations').map(function(p) {
    return convert(p, context)
  })
  return res
}

converters.VariableDeclarator = function(path, context) {
  return {
    kind: 'initial',
    id: convert(path.get('id'), context),
    value: convert(path.get('init'), context),
  }
}

converters.Identifier = function(path, context) {
  var kind = babelIdentifiers.getIdentifierKind(path)
  var name = path.node.name

  if (context.mode === 'value') {
    if (kind === 'reference') {
      var binding = path.scope.getBinding(name)

      if (binding) {
        var bindingPath = binding.path
        var foundPath = null

        if (bindingPath.isVariableDeclaration()) {
          foundPath = bindingPath.get('declarators').find(function(p) {
            return p.node.name === name
          })
        } else if (bindingPath.isVariableDeclarator()) {
          foundPath = bindingPath.get('init')
        } else if (
          bindingPath.isImportDefaultSpecifier() ||
          bindingPath.isImportNamespaceSpecifier()
        ) {
          foundPath = bindingPath
        } else if (bindingPath.isImportSpecifier()) {
          foundPath = bindingPath
        } else if (bindingPath.isDeclaration()) {
          foundPath = bindingPath.get('id')
        }

        if (foundPath === null || foundPath === undefined) {
          throw new Error(
            'Unable to resolve binding path for: '.concat(bindingPath.type)
          )
        }

        var convertedValue = convert(foundPath, context)
        return _objectSpread({}, convertedValue, {
          referenceIdName: path.node.name,
        })
      } else {
        var type = null

        if (path.node.typeAnnotation) {
          type = convert(
            path.get('typeAnnotation'),
            _objectSpread({}, context, {
              mode: 'type',
            })
          )
        }

        return {
          kind: 'id',
          name: name,
          type: type,
        }
      }
    } else if (kind === 'static' || kind === 'binding') {
      var _type = null

      if (path.node.typeAnnotation) {
        _type = convert(
          path.get('typeAnnotation'),
          _objectSpread({}, context, {
            mode: 'type',
          })
        )
      }

      return {
        kind: 'id',
        name: name,
        type: _type,
      }
    } else {
      throw new Error('Unable to resolve path for: '.concat(kind))
    }
  } else if (context.mode === 'type') {
    if (kind === 'reference') {
      var _bindingPath

      if (babelFlowIdentifiers.isFlowIdentifier(path)) {
        var flowBinding = babelTypeScopes.getTypeBinding(path, name)
        if (!flowBinding) throw new Error()
        _bindingPath = flowBinding.path.parentPath
      } else if (isTsIdentifier(path)) {
        var _foundPath = path.scope.getBinding(name)

        if (
          _foundPath &&
          (_foundPath.path.isImportDefaultSpecifier() ||
            _foundPath.path.isImportNamespaceSpecifier() ||
            _foundPath.path.isImportSpecifier())
        ) {
          return convert(_foundPath.path, context)
        }

        var tsBinding = babelTypeScopes.getTypeBinding(path, name)

        if (!tsBinding) {
          return {
            kind: 'id',
            name: name,
          }
        }

        _bindingPath = tsBinding.path.parentPath
      } else {
        _bindingPath = path.scope.getBinding(name)
      }

      if (_bindingPath) {
        if (_bindingPath.kind === 'module') {
          _bindingPath = _bindingPath.path
        } // If path is a descendant of bindingPath and share the same name, this is a recursive type.

        if (
          path.isDescendant(_bindingPath) &&
          _bindingPath.get('id').node.name === name
        ) {
          return {
            kind: 'id',
            name: name,
          }
        } // This is a hack that stops horrible regression errors and problems

        if (_bindingPath.kind === 'unknown') {
          return {
            kind: 'id',
            name: name,
          }
        }

        if (_bindingPath.kind !== 'module') {
          var _convertedValue = convert(_bindingPath, context)

          return _objectSpread({}, _convertedValue, {
            referenceIdName: path.node.name,
          })
        }
      } else {
        return {
          kind: 'id',
          name: name,
        }
      }
    } else if (kind === 'static' || kind === 'binding') {
      return {
        kind: 'id',
        name: name,
      }
    }
  }

  throw new Error(
    'Could not parse Identifier '.concat(name, ' in mode ').concat(context.mode)
  )
}

converters.TypeAlias = function(path, context) {
  return convert(path.get('right'), context)
}

converters.IntersectionTypeAnnotation = function(path, context) {
  var types = path.get('types').map(function(p) {
    return convert(p, context)
  })
  return {
    kind: 'intersection',
    types: types,
  }
}

converters.QualifiedTypeIdentifier = function(path, context) {
  return convert(path.get('id'), context)
}
/* eslint-disable-next-line no-unused-vars */

converters.VoidTypeAnnotation = function(path) {
  return {
    kind: 'void',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.BooleanTypeAnnotation = function(path) {
  return {
    kind: 'boolean',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.BooleanLiteralTypeAnnotation = function(path) {
  return {
    kind: 'boolean',
    value: path.node.value,
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.NullLiteralTypeAnnotation = function(path) {
  return {
    kind: 'null',
  }
}

converters.StringLiteralTypeAnnotation = function(path) {
  return {
    kind: 'string',
    value: path.node.value,
  }
} // This should absolutely return a value

converters.NumberLiteralTypeAnnotation = function(path) {
  return {
    kind: 'number',
    value: path.node.value,
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.MixedTypeAnnotation = function(path) {
  return {
    kind: 'mixed',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.AnyTypeAnnotation = function(path) {
  return {
    kind: 'any',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.NumberTypeAnnotation = function(path) {
  return {
    kind: 'number',
  }
}

converters.FunctionTypeParam = function(path, context) {
  return convert(path.get('typeAnnotation'), context)
}

converters.FunctionTypeAnnotation = function(path, context) {
  var parameters = path.get('params').map(function(p) {
    return convertParameter(p, context)
  })
  var returnType = convert(path.get('returnType'), context)
  return {
    parameters: parameters,
    returnType: returnType,
    kind: 'function',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.StringTypeAnnotation = function(path) {
  return {
    kind: 'string',
  }
}

converters.NullableTypeAnnotation = function(path, context) {
  return {
    kind: 'nullable',
    arguments: convert(path.get('typeAnnotation'), context),
  }
}

converters.TSIndexedAccessType = function(path, context) {
  var type = convert(path.get('objectType'), context)
  var indexKey = path.get('indexType').node.literal.value

  if (type.kind === 'generic') {
    if (type.value.members) {
      var member = type.value.members.find(function(scopedMember) {
        return scopedMember.key.name === indexKey
      })

      if (member) {
        return member.value
      }
    }

    var name = type.value.name || type.value.referenceIdName
    return {
      kind: 'generic',
      value: {
        kind: type.value.kind,
        name: ''.concat(name.name || name, "['").concat(indexKey, "']"),
      },
    }
  } else {
    throw new Error('Unsupported TSIndexedAccessType kind: '.concat(type.kind))
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.TSStringKeyword = function(path) {
  return {
    kind: 'string',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.TSNumberKeyword = function(path) {
  return {
    kind: 'number',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.TSBooleanKeyword = function(path) {
  return {
    kind: 'boolean',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.TSVoidKeyword = function(path) {
  return {
    kind: 'void',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.TSUndefinedKeyword = function(path, context) {
  return {
    kind: 'void',
  }
}

converters.TSTypeLiteral = function(path, context) {
  return {
    kind: 'object',
    members: path.get('members').map(function(memberPath) {
      return convert(memberPath, context)
    }),
  }
}

converters.TSPropertySignature = function(path, context) {
  return {
    kind: 'property',
    optional: !!path.node.optional,
    key: convert(path.get('key'), context),
    value: convert(path.get('typeAnnotation'), context),
  }
}

converters.TSTypeAliasDeclaration = function(path, context) {
  return convert(path.get('typeAnnotation'), context)
}

converters.TSLiteralType = function(path) {
  return {
    kind: 'string',
    value: path.node.literal.value,
  }
}

converters.TSTypeReference = function(path, context) {
  var typeParameters = path.get('typeParameters')

  if (typeParameters.node) {
    return {
      kind: 'generic',
      typeParams: convert(typeParameters, context),
      key: convert(path.get('key'), context),
      value: convert(path.get('typeName'), context),
    }
  }

  return {
    kind: 'generic',
    value: convert(path.get('typeName'), context),
  }
}

converters.TSUnionType = function(path, context) {
  var types = path.get('types').map(function(p) {
    return convert(p, context)
  })
  return {
    kind: 'union',
    types: types,
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.TSAnyKeyword = function(path) {
  return {
    kind: 'any',
  }
}

converters.TSTupleType = function(path, context) {
  var types = path.get('elementTypes').map(function(p) {
    return convert(p, context)
  })
  return {
    kind: 'tuple',
    types: types,
  }
}

converters.TSFunctionType = function(path, context) {
  var parameters = path.get('parameters').map(function(p) {
    return convertParameter(p, context)
  })
  var returnType = convert(path.get('typeAnnotation'), context)
  return {
    kind: 'generic',
    value: {
      kind: 'function',
      returnType: returnType,
      parameters: parameters,
    },
  }
}

converters.TSMethodSignature = function(path, context) {
  return {
    kind: 'property',
    optional: !!path.node.optional,
    key: convert(path.get('key'), context),
    value: convertMethodCall(path, context),
  }
}

converters.TSCallSignatureDeclaration = function(path, context) {
  return {
    kind: 'property',
    key: {
      kind: 'string',
    },
    optional: false,
    value: convertMethodCall(path, context),
  }
}

converters.TSInterfaceDeclaration = function(path, context) {
  var extendedTypes = extendedTypesMembers(path, context)
  var interfaceType = convert(path.get('body'), context) || {
    members: [],
  }
  return {
    kind: 'object',
    // Merge the current interface members with any extended members
    members: interfaceType.members.concat(extendedTypes),
  }
}

converters.TSExpressionWithTypeArguments = function(path, context) {
  return convert(path.get('expression'), context)
}

converters.TSInterfaceBody = function(path, context) {
  return {
    kind: 'object',
    members: path.get('body').map(function(prop) {
      return convert(prop, context)
    }),
  }
}

converters.TSTypeAnnotation = function(path, context) {
  return convert(path.get('typeAnnotation'), context)
}

converters.TSQualifiedName = function(path, context) {
  var left = convert(path.get('left'), context)
  var right = convert(path.get('right'), context)
  return {
    kind: 'id',
    name: ''.concat(left.name || left.referenceIdName, '.').concat(right.name),
  }
}

converters.TSEnumDeclaration = function(path, context) {
  var name = path.get('id').node.name
  var types = path.get('members').map(function(p) {
    var member = convert(p, context)
    return {
      kind: member.kind,
      name: ''.concat(name, '.').concat(member.name),
    }
  })
  return {
    kind: 'union',
    types: types,
  }
}

converters.TSEnumMember = function(path, context) {
  return convert(path.get('id'), context)
}
/* eslint-disable-next-line no-unused-vars */

converters.TSArray = function(path, context) {
  return {
    kind: 'any',
  }
}

converters.TSArrayType = function(path, context) {
  return {
    kind: 'arrayType',
    type: convert(path.get('elementType'), context),
  }
}

converters.TSTypeParameterInstantiation = function(path, context) {
  return {
    kind: 'typeParams',
    params: path.get('params').map(function(param) {
      return convert(param, context)
    }),
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.ImportNamespaceSpecifier = function(path, context) {
  return {
    kind: 'any',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.undefined = function(path, context) {
  return {
    kind: 'any',
  }
}

converters.ObjectTypeSpreadProperty = function(path, context) {
  return {
    kind: 'spread',
    value: convert(path.get('argument'), context),
  }
}

converters.ArrayTypeAnnotation = function(path, context) {
  return {
    kind: 'arrayType',
    type: convert(path.get('elementType'), context),
  }
}

converters.TSIntersectionType = function(path, context) {
  var types = path.get('types').map(function(type) {
    return convert(type, context)
  })
  return {
    kind: 'intersection',
    types: types,
  }
}

converters.TSIndexSignature = function(path, context) {
  var id = path.get('parameters')[0]
  return {
    kind: 'property',
    key: {
      kind: 'id',
      name: '['
        .concat(convert(id, context).name, ': ')
        .concat(convert(id.get('typeAnnotation'), context).kind, ']'),
    },
    value: convert(path.get('typeAnnotation'), context),
  }
}

converters.TSParenthesizedType = function(path, context) {
  return convert(path.get('typeAnnotation'), context)
}
/* eslint-disable-next-line no-unused-vars */

converters.TSObjectKeyword = function(path, context) {
  return {
    kind: 'object',
    members: [],
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.TSNullKeyword = function(path, context) {
  return {
    kind: 'null',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.TSUnknownKeyword = function(path, context) {
  return {
    kind: 'unknown',
  }
}
/* eslint-disable-next-line no-unused-vars */

converters.TSThisType = function(path, context) {
  return {
    kind: 'custom',
    value: 'this',
  }
}

converters.TSAsExpression = function(path, context) {
  return convert(path.get('expression'), context)
}

function extendedTypesMembers(path, context) {
  var members = path.get('extends')

  if (!members || !members.length) {
    return []
  }

  return members.reduce(function(acc, current) {
    var converted = convert(current, context)
    return acc.concat(converted.members)
  }, [])
}

function importConverterGeneral(path, context) {
  var importKind = path.node.importKind || path.parent.importKind || 'value'
  var moduleSpecifier = path.parent.source.value
  var name
  var kind = path.parent.importKind

  if (path.type === 'ImportDefaultSpecifier' && kind === 'value') {
    name = 'default'
  } else if (path.node.imported) {
    name = path.node.imported.name
  } else {
    name = path.node.local.name
  }

  if (!path.hub.file.opts.filename) {
    return {
      kind: 'import',
      importKind: importKind,
      name: name,
      moduleSpecifier: moduleSpecifier,
    }
  } else {
    if (kind === 'typeof') {
      throw new Error({
        path: path,
        error: 'import typeof is unsupported',
      })
    }

    var filePath

    try {
      filePath = babelFileLoader.resolveImportFilePathSync(
        path.parentPath,
        context.resolveOptions
      )
    } catch (e) {
      return {
        kind: 'import',
        importKind: importKind,
        name: name,
        moduleSpecifier: moduleSpecifier,
      }
    }

    if (!filePath) {
      return {
        kind: 'import',
        importKind: importKind,
        name: name,
        moduleSpecifier: moduleSpecifier,
      }
    } // Don't attempt to parse JSON

    if (nodePath.extname(filePath) === '.json') {
      return {
        kind: 'import',
        importKind: importKind,
        name: name,
        moduleSpecifier: moduleSpecifier,
      }
    }

    var file = babelFileLoader.loadFileSync(filePath, context.parserOpts)
    var id

    if (path.node.imported) {
      id = path.node.imported.name
    } else {
      id = path.node.local.name
    }

    var exported = matchExported(file, name)

    if (!exported) {
      exported = recursivelyResolveExportAll(file.path, context, name)

      if (!exported) {
        return {
          kind: 'import',
          importKind: importKind,
          name: name,
          moduleSpecifier: moduleSpecifier,
        }
      }
    }

    return convert(
      exported,
      _objectSpread({}, context, {
        replacementId: t.identifier(id),
      })
    )
  }
}

converters.ImportDefaultSpecifier = function(path, context) {
  return importConverterGeneral(path, context)
}

converters.ImportDeclaration = function(path, context) {
  var importKind = path.node.importKind || 'value'
  var moduleSpecifier = path.get('source').node.value
  var name = 'default'

  if (!context.replacementId) {
    return {
      kind: 'import',
      importKind: importKind,
      name: name,
      moduleSpecifier: moduleSpecifier,
    }
  }

  var filePath = babelFileLoader.resolveImportFilePathSync(
    path,
    context.resolveOptions
  )
  var file = babelFileLoader.loadFileSync(filePath, context.parserOpts)
  var exported = matchExported(file, context.replacementId.name)

  if (!exported) {
    return {
      kind: 'import',
      importKind: importKind,
      name: name,
      moduleSpecifier: moduleSpecifier,
    }
  }

  return convert(exported, context)
}

converters.ExportSpecifier = function(path, context) {
  var local = convert(path.get('local'), context)
  var exported = convert(path.get('exported'), context)
  return {
    kind: 'exportSpecifier',
    local: local,
    exported: exported,
  }
}

converters.ExportNamedDeclaration = function(path, context) {
  var specifiers = path.get('specifiers') // This needs to be in all of them --- let source = path.get('source');

  if (path.get('source').node) {
    var source = path.get('source')

    if (specifiers.length !== 1) {
      return {
        kind: 'export',
        exports: specifiers.map(function(s) {
          return convert(s, context)
        }),
        source: convert(source, context),
      }
    }

    var name = convert(specifiers[0], context).local.name
    var file

    try {
      // The parentPath is a reference to where we currently are. We want to
      // get the source value, but resolving this first makes this easier.
      var filePath = babelFileLoader.resolveImportFilePathSync(
        source.parentPath,
        context.resolveOptions
      )
      var actualPath = resolve.sync(
        nodePath.join(nodePath.dirname(filePath), source.node.value),
        context.resolveOptions
      )
      file = babelFileLoader.loadFileSync(actualPath, context.parserOpts) // We need to calculate name from the specifiers, I think knowing that there
      // will always be one specifier

      var resolvedValue = matchExported(file, name)

      if (resolvedValue) {
        return convert(resolvedValue, context)
      }

      return {
        kind: 'export',
        exports: specifiers.map(function(s) {
          return convert(s, context)
        }),
        source: convert(source, context),
      }
    } catch (e) {
      return {
        kind: 'export',
        exports: specifiers.map(function(s) {
          return convert(s, context)
        }),
        source: convert(source, context),
      }
    }
  } else {
    return {
      kind: 'export',
      exports: specifiers.map(function(s) {
        return convert(s, context)
      }),
    }
  }
}

converters.ImportSpecifier = function(path, context) {
  return importConverterGeneral(path, context)
}

converters.TSConditionalType = function() {
  return {
    kind: 'any',
  }
}

function convertMethodCall(path, context) {
  var parameters = path.get('parameters').map(function(p) {
    return convertParameter(p, context)
  })
  var returnType = convert(path.get('typeAnnotation'), context)
  return {
    kind: 'function',
    returnType: returnType,
    parameters: parameters,
  }
}

function mapComment(comment) {
  return {
    type: comment.type === 'CommentLine' ? 'commentLine' : 'commentBlock',
    value: babelNormalizeComments.normalizeComment(comment),
    raw: comment.value,
  }
}

function attachCommentProperty(source, dest, name) {
  if (!source || !source[name]) return
  if (!dest[name]) dest[name] = []
  var comments = source[name].map(mapComment)
  dest[name] = dest[name].concat(comments)
}

function attachComments(source, dest) {
  attachCommentProperty(source, dest, 'leadingComments')
  attachCommentProperty(source, dest, 'trailingComments')
  attachCommentProperty(source, dest, 'innerComments')
} // This function is from mdn:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#Examples

var getCircularReplacer = function getCircularReplacer() {
  var seen = new WeakSet()
  return function(key, value) {
    if (_typeof(value) === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }

      seen.add(value)
    }

    return value
  }
}

function convert(path, context) {
  if (typeof path.get !== 'function') {
    // We were getting incredible unhelpful errors here at times, so we have a circular replacement
    // throw path.identifier;
    var stringedPath = JSON.stringify(path, getCircularReplacer(), 2)
    throw new Error(
      'Did not pass a NodePath to convert() '.concat(stringedPath)
    )
  }

  var converter = converters[path.type]
  if (!converter) throw new Error('Missing converter for: '.concat(path.type))
  var result = converter(path, context)
  attachComments(path.node, result)
  return result
}

function getContext(typeSystem, filename, resolveOptions) {
  var plugins = [
    'jsx',
    [
      'decorators',
      {
        decoratorsBeforeExport: true,
      },
    ],
  ]
  /* eslint-disable-next-line no-param-reassign */

  if (!resolveOptions) resolveOptions = {}

  if (!resolveOptions.extensions) {
    // The resolve package that babel-file-loader uses only resolves .js files by default instead of the
    // default extension list of node (.js, .json and .node) so add .json back here.
    resolveOptions.extensions = ['.js', '.json']
  }

  if (typeSystem === 'flow') {
    plugins.push([
      'flow',
      {
        all: true,
      },
    ])
  } else if (typeSystem === 'typescript') {
    plugins.push('typescript')
    resolveOptions.extensions.push('.tsx')
    resolveOptions.extensions.push('.ts')
  } else {
    throw new Error('typeSystem must be either "flow" or "typescript"')
  }
  /* $FlowFixMe - need to update types in babylon-options */

  var parserOpts = createBabylonOptions({
    stage: 2,
    plugins: plugins,
  })
  return {
    resolveOptions: resolveOptions,
    parserOpts: parserOpts,
  }
}

function exportedComponents(programPath, componentsToFind, context) {
  var components = []
  findExports(programPath, componentsToFind).forEach(function(_ref) {
    const path = _ref.path
    const name = _ref.name

    if (
      path.isFunctionExpression() ||
      path.isArrowFunctionExpression() ||
      path.isFunctionDeclaration()
    ) {
      var component = convertReactComponentFunction(path, context)
      components.push({
        name: name,
        path: path,
        component: component,
      })
      return
    }

    if (path.isClass()) {
      var _component = convertReactComponentClass(path, context)

      components.push({
        name: name,
        path: path,
        component: _component,
      })
      return
    }

    var isMemo = isSpecialReactComponentType(path, 'memo')

    if (isMemo || isSpecialReactComponentType(path, 'forwardRef')) {
      var firstArg = path.get('arguments')[0]

      if (firstArg) {
        if (
          firstArg.isFunctionExpression() ||
          firstArg.isArrowFunctionExpression()
        ) {
          var _component2 = convertReactComponentFunction(firstArg, context)

          components.push({
            name: name,
            path: path,
            component: _component2,
          })
          return
        }

        if (isMemo && isSpecialReactComponentType(firstArg, 'forwardRef')) {
          var innerFirstArg = firstArg.get('arguments')[0]

          if (
            innerFirstArg.isFunctionExpression() ||
            innerFirstArg.isArrowFunctionExpression()
          ) {
            var _component3 = convertReactComponentFunction(
              innerFirstArg,
              context
            )

            components.push({
              name: name,
              path: path,
              component: _component3,
            })
          }
        }
      }
    }
  })
  return components
}

var findExportedComponents = function findExportedComponents(
  programPath,
  typeSystem,
  filename,
  resolveOptions
) {
  return exportedComponents(
    programPath,
    'all',
    getContext(typeSystem, filename, resolveOptions)
  )
}

exports.exportedComponents = exportedComponents
exports.findExportedComponents = findExportedComponents
exports.getContext = getContext
