import { AuthProvider } from '@/provider/AuthProvider'
import { lightTheme } from '@/themes'
import '@/themes/styles/App.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { FC } from 'react'
import { Routes } from 'react-router-dom'

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
            <Routes></Routes>
          </AuthProvider>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
