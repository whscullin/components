function prettyComponent(component) {
  return (
    component && {
      props: prettyProps(component.value),
    }
  )
}

function prettyLeadingComments(leadingComments) {
  return (
    (leadingComments &&
      leadingComments
        .map(c => c.value)
        .filter(Boolean)
        .join('\n\n')) ||
    ''
  )
}

function prettyProp(member) {
  return {
    description: prettyLeadingComments(member.leadingComments),
    name: member.key.name,
    required: !member.optional,
    value: prettyValue(member.value),
  }
}

function prettyProps(value) {
  return (
    (value && value.members && value.members.filter(Boolean).map(prettyProp)) ||
    []
  )
}

function prettyParameter(parameter) {
  const name = parameter.value.name
  const kind = parameter.type ? `: ${parameter.type.kind}` : ''
  return name + kind
}

function prettyParameters(parameters) {
  return parameters && parameters.map(prettyParameter)
}

function prettyValue(value) {
  if (!value) {
    return
  }

  if (value.value) {
    if (value.value.kind === 'function') {
      return `(${prettyParameters(value.value.parameters)}) => ${
        value.value.returnType.kind
      }`
    }
  }

  return value.kind
}

function pretty(types) {
  return types.map(type => ({
    name: type.name,
    component: prettyComponent(type.component),
  }))
}

module.exports = pretty
