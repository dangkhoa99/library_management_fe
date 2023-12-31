export const BASE_URL = 'http://localhost:5000/api'

export const MAX_FILE_SIZE = 512 // 500 KB

export const Routes = {
  LOGIN: 'login',
  USER: 'users',
  CUSTOMER: 'customers',
  BOOK: 'books',
  CATEGORY: 'categories',
  BORROW: 'borrows',
  LIBRARIAN: 'librarians',
  AUTHOR: 'authors',
  CHANGE_PASSWORD: 'change-password',
}

export const RestEndpoints = {
  AUTH: 'auth',
  LOGIN: 'auth/signIn',
  WHO_AM_I: 'auth/whoAmI',
  USER: 'users',
  AUTHOR: 'users/authors',
  CUSTOMER: 'users/customers',
  LIBRARIAN: 'users/librarians',
  CHANGE_PASSWORD: 'users/changePassword',
  BOOK: 'books',
  CATEGORY: 'categories',
  BORROW: 'borrows',
  IMAGE: 'images',
  UPLOAD_IMAGE: 'images/uploadImage',
}

export class Statuses {
  static readonly ACTIVE: string = 'ACTIVE'
  static readonly INACTIVE: string = 'INACTIVE'
  static readonly ERROR: string = 'ERROR'
  static readonly SUCCESS: string = 'SUCCESS'
  static readonly PENDING: string = 'PENDING'
  static readonly CANCELLED: string = 'CANCELLED'
  static readonly APPROVED: string = 'APPROVED'
  static readonly COMPLETED: string = 'COMPLETED'

  // Borrow status
  static readonly CHECKED_OUT: string = 'CHECKED_OUT'
  static readonly OVERDUE: string = 'OVERDUE'
  static readonly RETURNED: string = 'RETURNED'

  static readonly NAME = {
    [this.ACTIVE]: 'Active',
    [this.INACTIVE]: 'Inactive',
    [this.ERROR]: 'Error',
    [this.SUCCESS]: 'Success',
    [this.PENDING]: 'Pending',
    [this.CANCELLED]: 'Cancelled',
    [this.APPROVED]: 'Approved',
    [this.COMPLETED]: 'Completed',
    [this.CHECKED_OUT]: 'Checked out',
    [this.OVERDUE]: 'Overdue',
    [this.RETURNED]: 'Returned',
  }

  static readonly COLOR: { [key: string]: any } = {
    [this.CHECKED_OUT]: 'info',
    [this.OVERDUE]: 'error',
    [this.RETURNED]: 'success',
  }
}

export const Roles = {
  SUPER_ADMIN: '99-super-admin',
  ADMIN: '98-admin',
  MANAGER: '90-manager', //librarian
  AUTHOR: '10-author',
  USER: '01-user',
}

export const RolesColor = {
  SUPER_ADMIN: 'info',
  ADMIN: 'success',
  MANAGER: 'success',
  AUTHOR: 'success',
  USER: 'warning',
}

export const RoleArr = [
  { code: Roles.SUPER_ADMIN, name: 'Super Admin' },
  { code: Roles.ADMIN, name: 'Admin' },
  { code: Roles.MANAGER, name: 'Manager' },
  { code: Roles.AUTHOR, name: 'Author' },
  { code: Roles.USER, name: 'User' },
]

export class Genders {
  static readonly MALE: string = '01-male'
  static readonly FEMALE: string = '02-female'
  static readonly OTHER: string = '03-other'

  static readonly NAME = {
    [this.MALE]: 'Male',
    [this.FEMALE]: 'Female',
    [this.OTHER]: 'Other',
  }

  static readonly ARRAY = [
    { code: this.MALE, name: this.NAME[this.MALE] },
    { code: this.FEMALE, name: this.NAME[this.FEMALE] },
    { code: this.OTHER, name: this.NAME[this.OTHER] },
  ]
}

export const regexEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const TableStyle = {
  muiTablePaperProps: {
    variant: 'outlined',
    elevation: 0,
    sx: {
      width: '100%',
      height: '100%',
      overflow: 'hidden !important',
      display: 'flex',
      flexDirection: 'column',
    },
  },
  muiTableHeadRowProps: {
    sx: { backgroundColor: 'grey.300' },
  },
  muiTableHeadCellProps: {
    sx: {
      '.Mui-TableHeadCell-Content': {
        textAlign: 'center',
        justifyContent: 'center',
        color: 'black',
        '.Mui-TableHeadCell-Content-Labels': {
          '& > span': {
            position: 'unset',
          },
          '.MuiTableSortLabel-root': {
            position: 'absolute',
            top: '0',
            bottom: '0',
          },
        },
        '.Mui-TableHeadCell-Content-Actions': {
          position: 'absolute',
          left: '1px',
        },
      },
    },
  },
  muiTableBodyCellProps: {
    sx: {
      textAlign: 'center',
      border: '1px solid',
      borderColor: 'grey.100',
    },
  },
}
