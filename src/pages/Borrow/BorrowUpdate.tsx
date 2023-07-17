import FormWrapper from '@/common/components/FormWrapper'
import Loading from '@/common/components/Loading'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  Statuses,
  defaultBorrowFormValue,
} from '@/common/constants'
import { diffObject, loadLS, setBorrowFormValueHelper } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BorrowInput from './BorrowInput'
import { IBorrowFormValue } from '@/common/interfaces'
import dayjs from 'dayjs'

const BorrowUpdate: FC<{}> = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useMemo(() => loadLS('token'), [])

  const [originalFormValue, setOriginalFormValue] = useState<IBorrowFormValue>(
    defaultBorrowFormValue,
  )
  const [formValue, setFormValue] = useState<IBorrowFormValue>(
    defaultBorrowFormValue,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>('')

  const onFormValueChange = useCallback((key: string, value: any) => {
    setError(undefined)
    setBorrowFormValueHelper(key, value, setFormValue)
  }, [])

  const handleSubmit = () => {
    if (!token) return

    // Validation form
    if (!formValue.librarian) {
      setError('Name is required')
      return
    }

    const diff = diffObject(originalFormValue, formValue)

    console.log('[DIFF]', diff)

    if (!diff) return

    setIsLoading(true)

    axios({
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.BORROW}/${id}`,
      data: diff,
    })
      .then(() => {
        enqueueSnackbar('Update Borrow Ticket Success', { variant: 'success' })
        navigate(`/${Routes.BORROW}`)
      })
      .catch((_err) =>
        setError(_err?.response?.data?.message || 'Something went wrong'),
      )
      .finally(() => setIsLoading(false))
  }

  const submitReturnBook = () => {
    setIsLoading(true)

    axios({
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.BORROW}/${id}/changeStatus`,
      data: { status: Statuses.RETURNED },
    })
      .then(() => {
        enqueueSnackbar(
          `Update Borrow Ticket with Status: ${Statuses.RETURNED}`,
          { variant: 'success' },
        )
        navigate(`/${Routes.BORROW}`)
      })
      .catch((_err) =>
        setError(_err?.response?.data?.message || 'Something went wrong'),
      )
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (!token) return

    setIsLoading(true)

    axios({
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.BORROW}/${id}`,
    })
      .then((res) => {
        if (res.data.status === Statuses.CHECKED_OUT) {
          const overdue = dayjs().isAfter(dayjs(res.data.returnDate))

          if (overdue) {
            axios({
              method: 'patch',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `${token?.type} ${token?.value}`,
              },
              url: `${BASE_URL}/${RestEndpoints.BORROW}/${id}/changeStatus`,
              data: { status: Statuses.OVERDUE },
            })
              .then((_res) => {
                const value = {
                  ...res.data,
                  status: _res.data.status,
                  borrowDate: dayjs(res.data.borrowDate).format('YYYY-MM-DD'),
                  returnDate: dayjs(res.data.returnDate).format('YYYY-MM-DD'),
                  librarian: res.data.librarian._id,
                  librarianInfo: res.data.librarian,
                  customer: res.data.customer._id,
                  books: res.data.books.map((book: any) => ({
                    ...book,
                    bookInfo: book.book,
                    book: book.book._id,
                  })),
                }
                setFormValue(value)
                setOriginalFormValue(value)
              })
              .catch((_err) =>
                console.error(
                  '[ERROR]',
                  _err?.response?.data?.message || 'Something went wrong',
                ),
              )
            return
          }
        }

        const value = {
          ...res.data,
          borrowDate: dayjs(res.data.borrowDate).format('YYYY-MM-DD'),
          returnDate: dayjs(res.data.returnDate).format('YYYY-MM-DD'),
          librarian: res.data.librarian._id,
          librarianInfo: res.data.librarian,
          customer: res.data.customer._id,
          books: res.data.books.map((book: any) => ({
            ...book,
            bookInfo: book.book,
            book: book.book._id,
          })),
        }
        setFormValue(value)
        setOriginalFormValue(value)
      })
      .catch((err) =>
        setError(err.response?.data?.message || 'Something went wrong'),
      )
      .finally(() => setIsLoading(false))

    return () => {}
  }, [id, token])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FormWrapper
      actionTxt='Save'
      handleAction={handleSubmit}
      handleCancel={() => navigate(`/${Routes.BORROW}`)}
      disabledBtn={isLoading}
      showActionBtn={formValue.status !== Statuses.RETURNED}
      openBottomAction>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
            sx={{ textTransform: 'capitalize' }}>
            Edit Borrow Ticket
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <BorrowInput
            isUpdate
            formValue={formValue}
            onFormValueChange={onFormValueChange}
            isLoading={isLoading}
            error={error}
            submitReturnBook={submitReturnBook}
          />
        </Grid>
      </Grid>
    </FormWrapper>
  )
}

export default BorrowUpdate
