import { useAuth } from '@/hooks'
import { Box } from '@mui/material'
import { FC } from 'react'
import { Navigate, useOutlet } from 'react-router-dom'

const PublicLayout: FC<{}> = () => {
  const { authenticated } = useAuth()
  const outlet = useOutlet()

  if (authenticated) {
    return <Navigate to='/' replace />
  }

  return <Box sx={{ width: '100vw', height: '100vh' }}>{outlet}</Box>
}

export default PublicLayout
