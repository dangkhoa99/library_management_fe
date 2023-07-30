import { BASE_URL, Statuses } from '@/common/constants'
import { loadLS } from '@/utils'
import { Box, Grid, Paper, Typography } from '@mui/material'
import axios from 'axios'
import { FC, useEffect, useMemo, useState } from 'react'

const Dashboard: FC<{}> = () => {
  const token = useMemo(() => loadLS('token'), [])
  const [dashboard, setDashboard] = useState<{
    category?: number
    book?: number
    author?: number
    member?: number
    checkedOut?: number
    overDue?: number
    isLoading: boolean
  }>({
    category: 0,
    book: 0,
    author: 0,
    member: 0,
    checkedOut: 0,
    overDue: 0,
    isLoading: false,
  })

  useEffect(() => {
    if (!token) return

    setDashboard((prev) => ({ ...prev, isLoading: true }))
    const url = 'categories/count'
    axios({
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${url}`,
    })
      .then((res) => {
        setDashboard((prev) => ({
          ...prev,
          category: res.data.count,
          isLoading: false,
        }))
      })
      .catch((err) => console.error(`[ERROR][GET][${url}]`, err))
      .finally(() => setDashboard((prev) => ({ ...prev, isLoading: false })))

    return () => {}
  }, [])

  useEffect(() => {
    if (!token) return

    setDashboard((prev) => ({ ...prev, isLoading: true }))
    const url = 'books/count'
    axios({
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${url}`,
    })
      .then((res) => {
        setDashboard((prev) => ({
          ...prev,
          book: res.data.count,
          isLoading: false,
        }))
      })
      .catch((err) => console.error(`[ERROR][GET][${url}]`, err))
      .finally(() => setDashboard((prev) => ({ ...prev, isLoading: false })))

    return () => {}
  }, [])

  useEffect(() => {
    if (!token) return

    setDashboard((prev) => ({ ...prev, isLoading: true }))
    const url = 'users/customers/count'
    axios({
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${url}`,
    })
      .then((res) => {
        setDashboard((prev) => ({
          ...prev,
          member: res.data.count,
          isLoading: false,
        }))
      })
      .catch((err) => console.error(`[ERROR][GET][${url}]`, err))
      .finally(() => setDashboard((prev) => ({ ...prev, isLoading: false })))

    return () => {}
  }, [])

  useEffect(() => {
    if (!token) return

    setDashboard((prev) => ({ ...prev, isLoading: true }))
    const url = 'users/authors/count'
    axios({
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${url}`,
    })
      .then((res) => {
        setDashboard((prev) => ({
          ...prev,
          author: res.data.count,
          isLoading: false,
        }))
      })
      .catch((err) => console.error(`[ERROR][GET][${url}]`, err))
      .finally(() => setDashboard((prev) => ({ ...prev, isLoading: false })))

    return () => {}
  }, [])

  useEffect(() => {
    if (!token) return

    setDashboard((prev) => ({ ...prev, isLoading: true }))
    const url = 'borrows/count'
    axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${url}`,
      data: { status: Statuses.CHECKED_OUT },
    })
      .then((res) => {
        setDashboard((prev) => ({
          ...prev,
          checkedOut: res.data.count,
          isLoading: false,
        }))
      })
      .catch((err) => console.error(`[ERROR][GET][${url}]`, err))
      .finally(() => setDashboard((prev) => ({ ...prev, isLoading: false })))

    return () => {}
  }, [])

  useEffect(() => {
    if (!token) return

    setDashboard((prev) => ({ ...prev, isLoading: true }))
    const url = 'borrows/count'
    axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${url}`,
      data: { status: Statuses.OVERDUE },
    })
      .then((res) => {
        setDashboard((prev) => ({
          ...prev,
          overDue: res.data.count,
          isLoading: false,
        }))
      })
      .catch((err) => console.error(`[ERROR][GET][${url}]`, err))
      .finally(() => setDashboard((prev) => ({ ...prev, isLoading: false })))

    return () => {}
  }, [])

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Paper variant='outlined' sx={{ p: 3, bgcolor: '#fff' }}>
        <Grid container rowGap={3}>
          <Grid item xs={12} container columnGap={3} wrap='nowrap'>
            <Grid
              item
              xs={3}
              sx={{
                p: 3,
                border: 1,
                borderRadius: 2,
                borderColor: 'grey.400',
              }}>
              <Typography variant='h4' fontWeight={500} textAlign='start'>
                Category
              </Typography>

              <Typography
                variant='h2'
                fontWeight={900}
                textAlign='start'
                color='primary'>
                {dashboard.category}
              </Typography>
            </Grid>

            <Grid
              item
              xs={3}
              sx={{
                p: 3,
                border: 1,
                borderRadius: 2,
                borderColor: 'grey.400',
              }}>
              <Typography variant='h4' fontWeight={500} textAlign='start'>
                Book
              </Typography>

              <Typography
                variant='h2'
                fontWeight={900}
                textAlign='start'
                color='primary'>
                {dashboard.book}
              </Typography>
            </Grid>

            <Grid
              item
              xs={3}
              sx={{
                p: 3,
                border: 1,
                borderRadius: 2,
                borderColor: 'grey.400',
              }}>
              <Typography variant='h4' fontWeight={500} textAlign='start'>
                Author
              </Typography>

              <Typography
                variant='h2'
                fontWeight={900}
                textAlign='start'
                color='primary'>
                {dashboard.author}
              </Typography>
            </Grid>

            <Grid
              item
              xs={3}
              sx={{
                p: 3,
                border: 1,
                borderRadius: 2,
                borderColor: 'grey.400',
              }}>
              <Typography variant='h4' fontWeight={500} textAlign='start'>
                Member
              </Typography>

              <Typography
                variant='h2'
                fontWeight={900}
                textAlign='start'
                color='primary'>
                {dashboard.member}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} container columnGap={3} wrap='nowrap'>
            <Grid
              item
              xs={6}
              sx={{
                p: 3,
                border: 1,
                borderRadius: 2,
                borderColor: 'grey.400',
              }}>
              <Typography variant='h4' fontWeight={500} textAlign='start'>
                Borrow Ticket (Checked Out)
              </Typography>

              <Typography
                variant='h2'
                fontWeight={900}
                textAlign='start'
                color='info.main'>
                {dashboard.checkedOut}
              </Typography>
            </Grid>

            <Grid
              item
              xs={6}
              sx={{
                p: 3,
                border: 1,
                borderRadius: 2,
                borderColor: 'grey.400',
              }}>
              <Typography variant='h4' fontWeight={500} textAlign='start'>
                Borrow Ticket (Overdue)
              </Typography>

              <Typography
                variant='h2'
                fontWeight={900}
                textAlign='start'
                color='error.main'>
                {dashboard.overDue}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default Dashboard
