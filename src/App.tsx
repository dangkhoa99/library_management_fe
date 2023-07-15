import { MainLayout, PublicLayout } from '@/common/layout'
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

const App: FC<{}> = () => {
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
                  <Route path='/login' element={<Login />} />
                </Route>

                <Route path='/' element={<MainLayout />}>
                  <Route path='' element={<Dashboard />} />
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
