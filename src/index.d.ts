export function map<TFromObject = any, TToObject = any> (
  from: { new(): TFromObject ;} | string | symbol,
  to: { new(): TToObject ;} | string | symbol,
  source: TFromObject
): TToObject

export interface FromMapper<TObject, TValue> {
  (x: TObject, propertyName: string): TValue
}

export interface ToMapper<TObject, TValue> {
  (x: TValue, propertyName: string): Partial<TObject>
}

export interface Mapper<TFromObject, TToObject> {
  <
    TFromValue, TToValue,
    TFromObject, TToObject,
    TFromMapper extends FromMapper<TFromObject, TToValue>,
    TToMapper extends ToMapper<TToObject, TFromValue>,
  >(from: TFromMapper, to: TToMapper): Function

  asIs: Function
  const<TFromValue, TToValue>(from: TFromValue, to: TToValue): Function
  rename(mappedPropertyName: keyof TToObject): Function
}

export function mapping<TFromObject = any, TToObject= any> (
  name: { new(): TToObject ;} | string | symbol
): Mapper<TFromObject, TToObject>
