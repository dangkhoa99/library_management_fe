import { Box, Paper, Typography } from '@mui/material'
import { FC } from 'react'

const Dashboard: FC<{}> = () => {
  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Paper variant='outlined' sx={{ p: 2, backgroundColor: '#fff' }}>
        <Typography variant='h4' fontWeight={900} textAlign='start'>
          Dashboard
        </Typography>
      </Paper>
    </Box>
  )
}

export default Dashboard
