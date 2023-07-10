export const saveLS = (key: string, value: any) => {
  if (!Storage) {
    return false
  }

  localStorage.setItem(key, JSON.stringify(value))

  return value
}

export const loadLS = (key: string) => {
  if (!Storage) {
    return false
  }

  try {
    const item = localStorage.getItem(key)

    if (item) {
      const record = JSON.parse(item)

      if (!record) {
        return false
      }

      return record
    }
  } catch (e) {
    return false
  }
}

export const updateLS = (key: string, value: string) => {
  if (!Storage) {
    return false
  }

  try {
    const item = localStorage.getItem(key)

    if (item) {
      const record = JSON.parse(item)

      if (!record) {
        return false
      }

      localStorage.setItem(key, JSON.stringify(value))

      return value
    }
  } catch (e) {
    return false
  }
}

export const removeLS = (key: string) => {
  if (!Storage) {
    return false
  }

  localStorage.removeItem(key)
}
