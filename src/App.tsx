import { PublicLayout } from '@/common/layout'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import { AuthProvider } from '@/provider/AuthProvider'
import { lightTheme } from '@/themes'
import '@/themes/styles/App.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'

const App: FC<{}> = () => {
  return (
    <ThemeProvider theme={lightTheme}>
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
            </Routes>
          </AuthProvider>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
