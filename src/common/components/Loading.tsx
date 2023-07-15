import { CircularProgress, Grid } from '@mui/material'
import { FC } from 'react'

const Loading: FC<{}> = () => {
  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      sx={{ width: '100%', height: '100%' }}>
      <CircularProgress />
    </Grid>
  )
}

export default Loading
