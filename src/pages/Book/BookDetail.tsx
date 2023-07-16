import FormWrapper from '@/common/components/FormWrapper'
import Loading from '@/common/components/Loading'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  defaultBookFormValue,
} from '@/common/constants'
import { loadLS } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BookInput from './BookInput'
import { IBookFormValue } from '@/common/interfaces'
import dayjs from 'dayjs'

const BookDetail: FC<{}> = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formValue, setFormValue] =
    useState<IBookFormValue>(defaultBookFormValue)
  const [isLoading, setIsLoading] = useState(false)

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
      url: `${BASE_URL}/${RestEndpoints.BOOK}/${id}`,
    })
      .then((res) => {
        const value = {
          ...res.data,
          publishDate: dayjs(res.data?.publishDate).format('YYYY-MM-DD'),
          author: res.data?.author._id,
          category: res.data?.category._id,
          previewImage: res.data?.image
            ? [{ ...res.data.image, id: res.data.image._id }]
            : [],
        }
        setFormValue(value)
      })
      .catch((err) => console.error(`[ERROR][Book]`, err))
      .finally(() => setIsLoading(false))

    return () => {}
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FormWrapper
      actionTxt='Edit'
      handleAction={() => navigate(`/${Routes.BOOK}/${id}/edit`)}
      handleCancel={() => navigate(`/${Routes.BOOK}`)}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
            sx={{ textTransform: 'capitalize' }}>
            Detail Book
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <BookInput isDetail formValue={formValue} isLoading={isLoading} />
        </Grid>
      </Grid>
    </FormWrapper>
  )
}

export default BookDetail
