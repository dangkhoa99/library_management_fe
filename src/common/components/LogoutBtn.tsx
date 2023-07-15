import { useAuth } from '@/hooks/useAuth'
import { Button } from '@mui/material'
import { FC } from 'react'

const LogoutBtn: FC<{}> = () => {
  const { logout } = useAuth()

  return (
    <Button
      disableElevation
      variant='outlined'
      onClick={logout}
      color='inherit'
      size='medium'
      sx={{ fontWeight: 900, fontSize: 16 }}>
      Logout
    </Button>
  )
}

export default LogoutBtn
