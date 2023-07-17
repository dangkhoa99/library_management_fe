export interface IMenu {
  id: string
  name: string
  icon: JSX.Element
  link: string
}

export interface IUser {
  _id: string
  id: string
  name: string
  role: string
  gender: string
  email: string
  phone: string
  address: string
  username: string
}

export interface IBook {
  _id: string
  id: string
  name: string
  description: string
  category: { _id: string; id: string; name: string }
  author: { _id: string; id: string; name: string }
  image: { _id: string; id: string; link: string }
  publisher: string
  quantity: number
  publishDate: string
}

export interface IGetList<T> {
  data: T[]
  isLoading?: boolean
}

export interface IGetOne<T> {
  data?: T
  isLoading?: boolean
}

//-------------------------------------------
export interface ILoginFormValue {
  username: string
  password: string
}

export interface IChangePasswordFormValue {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ICategoryFormValue {
  _id?: string
  id?: string
  name?: string
  description?: string
}

export interface IBookFormValue {
  _id?: string
  id?: string
  name?: string
  description?: string
  category?: string
  author?: string
  publisher?: string
  quantity?: number
  publishDate?: string
  image?: any[]
  imageFile?: any[]
  previewImage?: any[]
}

export interface IUserFormValue {
  _id?: string
  id?: string
  name?: string
  gender?: string
  email?: string
  phone?: string
  address?: string
  username?: string
  password?: string
}

export interface IBorrowFormValue {
  _id?: string
  id?: string
  librarian?: string
  librarianInfo?: IUser
  customer?: string
  customerInfo?: IUser
  books?: { bookInfo: IBook; book: string; quantity: number }[]
  borrowDate?: string
  returnDate?: string
  status?: string
  note?: string
}
