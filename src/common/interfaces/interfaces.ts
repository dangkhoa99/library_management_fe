export interface ILoginFormValue {
  username: string
  password: string
}

export interface IMenu {
  id: string
  name: string
  icon: JSX.Element
  link: string
}

export interface IUser {
  id: string
  username: string
  name: string
  role: string
}
