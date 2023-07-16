import { IUserFormValue } from '@/common/interfaces'
import { Genders } from '..'

export const defaultAuthorFormValue: IUserFormValue = {
  name: '',
  gender: Genders.OTHER,
}

export const defaultLibrarianFormValue: IUserFormValue = {
  ...defaultAuthorFormValue,
  username: '',
  password: '',
}
