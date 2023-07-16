import FormWrapper from '@/common/components/FormWrapper'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  defaultBorrowFormValue,
} from '@/common/constants'
import { IBorrowFormValue } from '@/common/interfaces'
import { loadLS, setBorrowFormValueHelper } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { FC, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BorrowInput from './BorrowInput'

const BorrowCreate: FC<{}> = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [createLoading, setCreateLoading] = useState(false)
  const [formValue, setFormValue] = useState<IBorrowFormValue>(
    defaultBorrowFormValue,
  )
  const [error, setError] = useState<string | undefined>('')

  const onFormValueChange = useCallback((key: string, value: any) => {
    setError(undefined)
    setBorrowFormValueHelper(key, value, setFormValue)
  }, [])

  const handleSubmit = () => {
    const token = loadLS('token')

    if (!token) return

    // Validation form
    if (!formValue.librarian) {
      setError('Creator is required')
      return
    }

    if (!formValue.customer) {
      setError('Member is required')
      return
    }

    if (!formValue.borrowDate) {
      setError('borrowDate is required')
      return
    }

    if (!formValue.returnDate) {
      setError('returnDate is required')
      return
    }

    if (!formValue.books || formValue.books.length === 0) {
      setError('Add least 1 book')
      return
    }

    const data = {
      ...formValue,
      books: formValue.books.map((item) => ({
        book: item.book,
        quantity: item.quantity,
      })),
    }

    setCreateLoading(true)

    axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.BORROW}`,
      data,
    })
      .then(() => {
        enqueueSnackbar('Create Borrow Ticket Success', { variant: 'success' })
        navigate(`/${Routes.BORROW}`)
      })
      .catch((err) =>
        setError(err?.response?.data?.message || 'Something went wrong'),
      )
      .finally(() => setCreateLoading(false))
  }

  return (
    <FormWrapper
      isLoading={createLoading}
      openBottomAction
      actionTxt='Create'
      handleAction={handleSubmit}
      handleCancel={() => navigate(`/${Routes.BORROW}`)}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
            sx={{ textTransform: 'capitalize' }}>
            New Borrow Ticket
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <BorrowInput
            formValue={formValue}
            onFormValueChange={onFormValueChange}
            isLoading={createLoading}
            error={error}
          />
        </Grid>
      </Grid>
    </FormWrapper>
  )
}

export default BorrowCreate
