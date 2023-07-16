import { v4 as uuidv4 } from 'uuid'

export const setBookFormValueHelper = (
  key: string,
  value: any,
  setFormValue: (prev: any) => void,
) => {
  switch (key) {
    case 'image':
      {
        const id = uuidv4()

        const imageFiles = value.target.files as File[]
        const previewImages =
          Array.from(imageFiles).map((image: File) => ({
            id,
            link: URL.createObjectURL(image),
            isLocal: true,
          })) || []

        setFormValue((prev: any) => ({
          ...prev,
          imageFile: [...prev['imageFile'], ...imageFiles],
          previewImage: [...prev.previewImage, ...previewImages],
        }))
      }
      break
    case 'deleteImage': {
      setFormValue((prev: any) => {
        const deletedId = prev.previewImage.findIndex(
          (item: { id: string }) => item.id === value,
        )

        return {
          ...prev,
          imageFile: prev.imageFile.filter(
            (_: any, index: number) => index !== deletedId,
          ),
          previewImage: prev.previewImage.filter(
            (_: any, index: number) => index !== deletedId,
          ),
        }
      })
      break
    }
    default:
      setFormValue((prev: any) => ({
        ...prev,
        [key]: value,
      }))
      break
  }
}
