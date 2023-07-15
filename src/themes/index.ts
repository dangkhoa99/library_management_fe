import { PaletteMode } from '@mui/material'
import { createTheme } from '@mui/material/styles'

const renderTheme = (mode: PaletteMode) => {
  return createTheme({
    spacing: 4,
    palette: {
      mode: mode,
      primary: { main: '#f57b32', light: '#fbd3bb', dark: '#ab5623' },
      secondary: { main: '#0095ff', light: '#33aaff', dark: '#0068b2' },
    },
    typography: { fontFamily: 'Roboto, Arial, san-serif' },
    zIndex: { appBar: 1200, drawer: 1100 },
  })
}

export const lightTheme = renderTheme('light')
