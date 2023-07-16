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

export interface IGetList<T> {
  data: T[]
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
