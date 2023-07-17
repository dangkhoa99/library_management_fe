import FormWrapper from '@/common/components/FormWrapper'
import Loading from '@/common/components/Loading'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  Statuses,
  defaultBorrowFormValue,
} from '@/common/constants'
import { loadLS } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BorrowInput from './BorrowInput'
import { IBorrowFormValue } from '@/common/interfaces'
import dayjs from 'dayjs'

const BorrowDetail: FC<{}> = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [formValue, setFormValue] = useState<IBorrowFormValue>(
    defaultBorrowFormValue,
  )

  useEffect(() => {
    const token = loadLS('token')

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
      })
      .catch((err) => console.error(`[ERROR][BorrowTicket]`, err))
      .finally(() => setIsLoading(false))

    return () => {}
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FormWrapper
      actionTxt='Edit'
      showActionBtn={formValue.status !== 'RETURNED'}
      handleAction={() => navigate(`/${Routes.BORROW}/${id}/edit`)}
      handleCancel={() => navigate(`/${Routes.BORROW}`)}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
            sx={{ textTransform: 'capitalize' }}>
            Detail Borrow Ticket
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <BorrowInput isDetail formValue={formValue} isLoading={isLoading} />
        </Grid>
      </Grid>
    </FormWrapper>
  )
}

export default BorrowDetail
