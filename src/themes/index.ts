import { PaletteMode } from '@mui/material'
import { createTheme } from '@mui/material/styles'

const renderTheme = (mode: PaletteMode) => {
  return createTheme({
    palette: {
      mode: mode,
      primary: { main: '#f57b32' },
      secondary: { main: '#0095ff' },
    },
    typography: { fontFamily: 'Roboto, Arial, san-serif' },
    zIndex: {
      appBar: 1200,
      drawer: 1100,
    },
  })
}

export const lightTheme = renderTheme('light')
