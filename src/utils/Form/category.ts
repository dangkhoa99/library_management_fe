export const setCategoryFormValueHelper = (
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
