import { Routes as RoutesApp } from '@/common/constants'
import { MainLayout, PublicLayout } from '@/common/layout'
import {
  Author,
  AuthorCreate,
  AuthorDetail,
  AuthorUpdate,
} from '@/pages/Author'
import { Book, BookCreate, BookDetail, BookUpdate } from '@/pages/Book'
import {
  Borrow,
  BorrowCreate,
  BorrowDetail,
  BorrowUpdate,
} from '@/pages/Borrow'
import {
  Category,
  CategoryCreate,
  CategoryDetail,
  CategoryUpdate,
} from '@/pages/Category'
import { ChangePassword } from '@/pages/ChangePassword'
import {
  Customer,
  CustomerCreate,
  CustomerDetail,
  CustomerUpdate,
} from '@/pages/Customer'
import Dashboard from '@/pages/Dashboard'
import {
  Librarian,
  LibrarianCreate,
  LibrarianDetail,
  LibrarianUpdate,
} from '@/pages/Librarian'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import { AuthProvider } from '@/provider/AuthProvider'
import { lightTheme } from '@/themes'
import '@/themes/styles/App.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { SnackbarProvider } from 'notistack'
import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'

const App: FC<{}> = () => {
  dayjs.extend(utc)
  return (
    <ThemeProvider theme={lightTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />

        <SnackbarProvider
          dense
          preventDuplicate
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <div className='App'>
            <AuthProvider>
              <Routes>
                <Route path='*' element={<NotFound />} />

                <Route element={<PublicLayout />}>
                  <Route path={`/${RoutesApp.LOGIN}`} element={<Login />} />
                </Route>

                <Route path='/' element={<MainLayout />}>
                  <Route path='' element={<Dashboard />} />
                  <Route
                    path={`${RoutesApp.CATEGORY}`}
                    element={<Category />}
                  />
                  <Route
                    path={`${RoutesApp.CATEGORY}/new`}
                    element={<CategoryCreate />}
                  />
                  <Route
                    path={`${RoutesApp.CATEGORY}/:id/show`}
                    element={<CategoryDetail />}
                  />
                  <Route
                    path={`${RoutesApp.CATEGORY}/:id/edit`}
                    element={<CategoryUpdate />}
                  />
                  <Route path={`${RoutesApp.BOOK}`} element={<Book />} />
                  <Route
                    path={`${RoutesApp.BOOK}/new`}
                    element={<BookCreate />}
                  />
                  <Route
                    path={`${RoutesApp.BOOK}/:id/show`}
                    element={<BookDetail />}
                  />
                  <Route
                    path={`${RoutesApp.BOOK}/:id/edit`}
                    element={<BookUpdate />}
                  />

                  <Route path={`${RoutesApp.AUTHOR}`} element={<Author />} />
                  <Route
                    path={`${RoutesApp.AUTHOR}/new`}
                    element={<AuthorCreate />}
                  />
                  <Route
                    path={`${RoutesApp.AUTHOR}/:id/show`}
                    element={<AuthorDetail />}
                  />
                  <Route
                    path={`${RoutesApp.AUTHOR}/:id/edit`}
                    element={<AuthorUpdate />}
                  />

                  <Route
                    path={`${RoutesApp.LIBRARIAN}`}
                    element={<Librarian />}
                  />
                  <Route
                    path={`${RoutesApp.LIBRARIAN}/new`}
                    element={<LibrarianCreate />}
                  />
                  <Route
                    path={`${RoutesApp.LIBRARIAN}/:id/show`}
                    element={<LibrarianDetail />}
                  />
                  <Route
                    path={`${RoutesApp.LIBRARIAN}/:id/edit`}
                    element={<LibrarianUpdate />}
                  />

                  <Route
                    path={`${RoutesApp.CUSTOMER}`}
                    element={<Customer />}
                  />
                  <Route
                    path={`${RoutesApp.CUSTOMER}/new`}
                    element={<CustomerCreate />}
                  />
                  <Route
                    path={`${RoutesApp.CUSTOMER}/:id/show`}
                    element={<CustomerDetail />}
                  />
                  <Route
                    path={`${RoutesApp.CUSTOMER}/:id/edit`}
                    element={<CustomerUpdate />}
                  />

                  <Route path={`${RoutesApp.BORROW}`} element={<Borrow />} />
                  <Route
                    path={`${RoutesApp.BORROW}/new`}
                    element={<BorrowCreate />}
                  />
                  <Route
                    path={`${RoutesApp.BORROW}/:id/show`}
                    element={<BorrowDetail />}
                  />
                  <Route
                    path={`${RoutesApp.BORROW}/:id/edit`}
                    element={<BorrowUpdate />}
                  />

                  <Route
                    path={`${RoutesApp.CHANGE_PASSWORD}`}
                    element={<ChangePassword />}
                  />
                </Route>
              </Routes>
            </AuthProvider>
          </div>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
