export const setAuthorFormValueHelper = (
  key: string,
  value: any,
  setFormValue: (prev: any) => void,
) => {
  switch (key) {
    default:
      setFormValue((prev: any) => ({
        ...prev,
        [key]: value,
      }))
      break
  }
}

export const setLibrarianFormValueHelper = (
  key: string,
  value: any,
  setFormValue: (prev: any) => void,
) => {
  switch (key) {
    default:
      setFormValue((prev: any) => ({
        ...prev,
        [key]: value,
      }))
      break
  }
}

export const setCustomerFormValueHelper = (
  key: string,
  value: any,
  setFormValue: (prev: any) => void,
) => {
  switch (key) {
    default:
      setFormValue((prev: any) => ({
        ...prev,
        [key]: value,
      }))
      break
  }
}
