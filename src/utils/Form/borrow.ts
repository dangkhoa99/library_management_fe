import { IBook } from '@/common/interfaces'

export const setBorrowFormValueHelper = (
  key: string,
  value: any,
  setFormValue: (prev: any) => void,
) => {
  switch (key) {
    case 'books':
      setFormValue((prev: any) => ({
        ...prev,
        [key]: value.map((item: IBook) => {
          return {
            bookInfo: {
              id: item._id,
              name: item.name,
              author: item.author,
              category: item.category,
              image: item.image,
            },
            book: item._id,
            quantity: 1,
          }
        }),
      }))

      break
    default:
      setFormValue((prev: any) => ({
        ...prev,
        [key]: value,
      }))
      break
  }
}
