import FormWrapper from '@/common/components/FormWrapper'
import Loading from '@/common/components/Loading'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  defaultBookFormValue,
} from '@/common/constants'
import { diffObject, loadLS, setBookFormValueHelper } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BookInput from './BookInput'
import { IBookFormValue } from '@/common/interfaces'
import dayjs from 'dayjs'

const BookUpdate: FC<{}> = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useMemo(() => loadLS('token'), [])

  const [originalFormValue, setOriginalFormValue] =
    useState<IBookFormValue>(defaultBookFormValue)
  const [formValue, setFormValue] =
    useState<IBookFormValue>(defaultBookFormValue)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>('')

  const onFormValueChange = useCallback((key: string, value: any) => {
    setError(undefined)
    setBookFormValueHelper(key, value, setFormValue)
  }, [])

  const handleSubmit = () => {
    if (!token) return

    // Validation form
    if (!formValue.name) {
      setError('Name is required')
      return
    }

    if (!formValue.category) {
      setError('Category is required')
      return
    }

    if (!formValue.author) {
      setError('Author is required')
      return
    }

    const diff = diffObject(originalFormValue, formValue)

    if (!diff) return

    if (diff.publishDate) {
      diff.publishDate = dayjs(diff.publishDate).utc().format()
    }

    if (diff.quantity) {
      diff.quantity = Number(diff.quantity)
    }

    const data = { ...diff }

    setIsLoading(true)

    axios({
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.BOOK}/${id}`,
      data,
    })
      .then(() => {
        enqueueSnackbar('Update Book Success', { variant: 'success' })
        navigate(`/${Routes.BOOK}`)
      })
      .catch((_err) => {
        console.error(`[ERROR][Book]`, _err)
        setError(_err?.response?.data?.message || 'Something went wrong')
      })
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
      url: `${BASE_URL}/${RestEndpoints.BOOK}/${id}`,
    })
      .then((res) => {
        const value = {
          ...res.data,
          publishDate: dayjs(res.data.publishDate).format('YYYY-MM-DD'),
          author: res.data.author._id,
          category: res.data.category._id,
        }
        setFormValue(value)
        setOriginalFormValue(value)
      })
      .catch((err) => {
        console.error(`[ERROR][Book]`, err)
        setError(err?.response?.data?.message || 'Something went wrong')
      })
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
      handleCancel={() => navigate(`/${Routes.BOOK}`)}
      disabledBtn={isLoading}
      openBottomAction>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight='600'
            sx={{ textTransform: 'capitalize' }}>
            Edit Book
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <BookInput
            isUpdate
            formValue={formValue}
            onFormValueChange={onFormValueChange}
            isLoading={isLoading}
            error={error}
          />
        </Grid>
      </Grid>
    </FormWrapper>
  )
}

export default BookUpdate
