import { isFunction } from './utils'

export const MAPPING_METADATA_KEY = 'object-mapping'

function setMapping (target, propertyName, mapping, from, to) {
  const mappingName = isFunction(mapping) ? mapping.name : mapping
  const key = `${MAPPING_METADATA_KEY}:${mappingName}`

  if (Reflect.hasMetadata(key, target, propertyName)) {
    throw new Error(`Mapping '${mapping}' already defined for '${propertyName}'`)
  }

  Reflect.defineMetadata(key, { from, to }, target, propertyName)

  const mappedProperties = Reflect.getMetadata(key, target) || []
  Reflect.defineMetadata(key, [ ...mappedProperties, propertyName ], target)
}

export default function mapping (origin) {
  const mapper = (from, to) => {
    if (!from || !to || !isFunction(from) || !isFunction(to)) {
      throw new Error('Both from & to mappers should be defined and should be functions')
    }

    return (target, propertyName, descriptor) => {
      setMapping(target, propertyName, origin, from, to)
      return descriptor
    }
  }

  mapper.asIs = (target, propertyName, descriptor) => {
    setMapping(target, propertyName, origin,
      x => x[propertyName],
      x => ({ [propertyName]: x })
    )
    return descriptor
  }

  mapper.const = (from, to) => (target, propertyName, descriptor) => {
    setMapping(target, propertyName, origin,
      x => from,
      x => ({ [propertyName]: to })
    )
    return descriptor
  }

  mapper.rename = (mappedPropertyName) => (target, propertyName, descriptor) => {
    setMapping(target, propertyName, origin,
      x => x[mappedPropertyName],
      x => ({ [mappedPropertyName]: x })
    )
    return descriptor
  }

  return mapper
}
