import { Routes as RoutesApp } from '@/common/constants'
import { MainLayout, PublicLayout } from '@/common/layout'
import { Book, BookCreate, BookDetail, BookUpdate } from '@/pages/Book'
import {
  Category,
  CategoryCreate,
  CategoryDetail,
  CategoryUpdate,
} from '@/pages/Category'
import { ChangePassword } from '@/pages/ChangePassword'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import { AuthProvider } from '@/provider/AuthProvider'
import { lightTheme } from '@/themes'
import '@/themes/styles/App.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { SnackbarProvider } from 'notistack'
import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

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
