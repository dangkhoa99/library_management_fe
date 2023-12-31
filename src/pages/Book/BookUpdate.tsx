import FormWrapper from '@/common/components/FormWrapper'
import Loading from '@/common/components/Loading'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  defaultBookFormValue,
} from '@/common/constants'
import {
  diffObject,
  loadLS,
  setBookFormValueHelper,
  validateFileSize,
} from '@/utils'
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

    const diff: IBookFormValue | null = diffObject(originalFormValue, formValue)

    if (!diff) return

    if (diff.publishDate) {
      diff.publishDate = dayjs(diff.publishDate).utc().format()
    }

    if (diff.quantity) {
      diff.quantity = Number(diff.quantity)
    }

    if (!diff.imageFile) {
      // Not Change/Remove Image
      setIsLoading(true)

      axios({
        method: 'patch',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token?.type} ${token?.value}`,
        },
        url: `${BASE_URL}/${RestEndpoints.BOOK}/${id}`,
        data: diff,
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

      return
    }

    if (diff.imageFile.length > 0) {
      // Change Image
      const validateImages = Array.from(diff.imageFile).every((image) =>
        validateFileSize(image),
      )

      if (!validateImages) {
        setError('Image size must be less than 500KB')
        return
      }

      const formData = new FormData()

      formData.append('image', diff.imageFile[0])

      setIsLoading(true)

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
          const { imageFile, previewImage, ...other } = diff

          const data = { ...other, image: res.data }

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
            .catch((_err) => setError(_err?.response?.data?.message))
        })
        .catch((err) => setError(err?.response?.data?.message))
        .finally(() => setIsLoading(false))
    } else {
      // Remove Image
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { imageFile, previewImage, ...other } = diff

      const data = { ...other, image: null }

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
        .catch((_err) => setError(_err?.response?.data?.message))
        .finally(() => setIsLoading(false))
    }
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
          publishDate: dayjs(res.data?.publishDate).format('YYYY-MM-DD'),
          author: res.data?.author._id,
          category: res.data?.category._id,
          image: res.data?.image
            ? [{ ...res.data.image, id: res.data.image._id }]
            : [],
          imageFile: res.data?.image
            ? [{ ...res.data.image, id: res.data.image._id }]
            : [],
          previewImage: res.data?.image
            ? [{ ...res.data.image, id: res.data.image._id }]
            : [],
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
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
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
