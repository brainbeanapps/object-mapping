import { MAPPING_METADATA_KEY } from './mapping'
import { isFunction } from './utils'

export default function map (from, to, source) {
  const fromKey = `${MAPPING_METADATA_KEY}:${isFunction(from) ? from.name : from}`
  const toKey = `${MAPPING_METADATA_KEY}:${isFunction(to) ? to.name : to}`

  let target
  let mapping
  if (isFunction(from) && Reflect.hasMetadata(toKey, from.prototype)) {
    target = from.prototype
    mapping = to
  } else if (isFunction(to) && Reflect.hasMetadata(fromKey, to.prototype)) {
    target = to.prototype
    mapping = from
  } else {
    throw new Error(`Mapping can not be found neither for '${from}' nor for '${to}'`)
  }

  const key = (mapping === to) ? toKey : fromKey
  const mappedProperties = Reflect.getMetadata(key, target)

  let destination = {}
  for (const propertyName of mappedProperties) {
    const mapper = Reflect.getMetadata(key, target, propertyName)

    if (mapping === to) {
      destination = Object.assign(destination, mapper.to(source[propertyName]))
    } else /* if (mapping === from) */ {
      destination = Object.assign(destination, { [propertyName]: mapper.from(source) })
    }
  }

  return destination
}
