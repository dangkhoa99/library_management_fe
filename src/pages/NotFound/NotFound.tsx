import { Button, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound: FC<{}> = () => {
  const navigate = useNavigate()

  return (
    <Grid container alignContent='center' gap={4} sx={{ height: '100vh' }}>
      <Grid item xs={12}>
        <Typography variant='h1' fontWeight={900}>
          404
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h4' fontWeight={600}>
          Page Not Found
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6' fontWeight={400}>
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Button
          disableElevation
          variant='contained'
          size='large'
          color='primary'
          sx={{ fontWeight: 900, fontSize: 16, color: '#fff' }}
          onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Grid>
    </Grid>
  )
}

export default NotFound
