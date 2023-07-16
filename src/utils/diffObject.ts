import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

export const diffObject = (prev: any, next: any): any => {
  const diff: any = {}

  const allKeys = Object.keys({ ...prev, ...next })

  let length = allKeys.length

  while (length > 0) {
    const key = allKeys[length - 1]
    if (!isEqual(next[key], prev[key])) {
      diff[key] = next[key]
    }

    length--
  }

  return isEmpty(diff) ? null : diff
}
