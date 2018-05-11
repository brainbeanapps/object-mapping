export function isFunction (x) {
  return x && {}.toString.call(x) === '[object Function]'
}
