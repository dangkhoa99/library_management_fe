import FormWrapper from '@/common/components/FormWrapper'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  defaultBookFormValue,
} from '@/common/constants'
import { loadLS, setBookFormValueHelper, validateFileSize } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookInput from './BookInput'
import { FC } from 'react'
import { IBookFormValue } from '@/common/interfaces'
import dayjs from 'dayjs'

const BookCreate: FC<{}> = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [createLoading, setCreateLoading] = useState(false)
  const [formValue, setFormValue] =
    useState<IBookFormValue>(defaultBookFormValue)
  const [error, setError] = useState<string | undefined>('')

  const onFormValueChange = useCallback((key: string, value: any) => {
    setError(undefined)
    setBookFormValueHelper(key, value, setFormValue)
  }, [])

  const handleSubmit = () => {
    const token = loadLS('token')

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

    if (formValue.publishDate) {
      formValue.publishDate = dayjs(formValue.publishDate).utc().format()
    }

    if (formValue.quantity) {
      formValue.quantity = Number(formValue.quantity)
    }

    if (!formValue.imageFile || formValue.imageFile?.length === 0) {
      setCreateLoading(true)

      axios({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token?.type} ${token?.value}`,
        },
        url: `${BASE_URL}/${RestEndpoints.BOOK}`,
        data: { ...formValue },
      })
        .then(() => {
          enqueueSnackbar('Create Book Success', { variant: 'success' })
          navigate(`/${Routes.BOOK}`)
        })
        .catch((err) =>
          setError(err?.response?.data?.message || 'Something went wrong'),
        )
        .finally(() => setCreateLoading(false))

      return
    }

    // Validation Size Image
    const validateImages = Array.from(formValue.imageFile).every((image) =>
      validateFileSize(image),
    )

    if (!validateImages) {
      setError('Image size must be less than 500KB')
      return
    }

    const formData = new FormData()

    formData.append('image', formValue.imageFile[0])

    setCreateLoading(true)

    axios({
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.UPLOAD_IMAGE}`,
      data: formData,
    })
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { imageFile, previewImage, ...other } = formValue

        const data = {
          ...other,
          image: res.data,
        }

        axios({
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token?.type} ${token?.value}`,
          },
          url: `${BASE_URL}/${RestEndpoints.BOOK}`,
          data,
        })
          .then(() => {
            enqueueSnackbar('Create Book Success', { variant: 'success' })
            navigate(`/${Routes.BOOK}`)
          })
          .catch((_err) =>
            setError(_err.response.data.message || 'Something went wrong'),
          )
      })
      .catch((err) =>
        setError(err.response.data.message || 'Something went wrong'),
      )
      .finally(() => setCreateLoading(false))
  }

  return (
    <FormWrapper
      isLoading={createLoading}
      openBottomAction
      actionTxt='Create'
      handleAction={handleSubmit}
      handleCancel={() => navigate(`/${Routes.BOOK}`)}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
            sx={{ textTransform: 'capitalize' }}>
            New Book
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <BookInput
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

export default BookCreate
