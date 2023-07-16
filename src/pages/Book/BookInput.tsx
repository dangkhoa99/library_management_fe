import { BASE_URL, RestEndpoints } from '@/common/constants'
import { IBookFormValue, IGetList, IUser } from '@/common/interfaces'
import { loadLS } from '@/utils'
import { Alert, Autocomplete, Box, Grid, TextField } from '@mui/material'
import axios from 'axios'
import { FC, memo, useEffect, useMemo, useState } from 'react'

const BookInput: FC<{
  formValue: IBookFormValue
  onFormValueChange?: (key: string, value: any) => void
  isLoading?: boolean
  isDetail?: boolean
  isUpdate?: boolean
  error?: string
}> = ({
  formValue,
  onFormValueChange = undefined,
  isLoading = false,
  isDetail = false,
  error = undefined,
}) => {
  const token = useMemo(() => loadLS('token'), [])

  const [category, setCategory] = useState<IGetList<IUser>>({
    data: [],
    isLoading: false,
  })

  const [author, setAuthor] = useState<IGetList<IUser>>({
    data: [],
    isLoading: false,
  })

  const currCategory = useMemo(
    () => category.data.find((item) => item._id === formValue.category) || null,
    [formValue.category, category.data],
  )

  const currAuthor = useMemo(
    () => author.data.find((item) => item._id === formValue.author) || null,
    [formValue.author, author.data],
  )

  useEffect(() => {
    if (!token) return

    setCategory((prev) => ({ ...prev, isLoading: true }))

    axios({
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.CATEGORY}`,
    })
      .then((res) => setCategory({ data: res.data, isLoading: false }))
      .catch((err) => console.error(`[ERROR][Category]`, err))
      .finally(() => setCategory((prev) => ({ ...prev, isLoading: false })))

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!token) return

    setAuthor((prev) => ({ ...prev, isLoading: true }))

    axios({
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.AUTHOR}`,
    })
      .then((res) => setAuthor({ data: res.data, isLoading: false }))
      .catch((err) => console.error(`[ERROR][Author]`, err))
      .finally(() => setAuthor((prev) => ({ ...prev, isLoading: false })))

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={{ width: '75%', m: '0 auto' }}>
      <Grid container rowSpacing={3}>
        {error && (
          <Grid item xs={12}>
            <Alert variant='outlined' severity='error'>
              {error}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            disabled={isLoading}
            required
            size='medium'
            label='Name'
            placeholder='Enter Name'
            value={formValue.name}
            onChange={(e) => onFormValueChange?.('name', e.target.value)}
            InputProps={{ readOnly: isDetail }}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            disabled={category.isLoading || isDetail || isLoading}
            fullWidth
            disableClearable={!!currCategory}
            value={currCategory}
            options={category.data}
            onChange={(_, newValue) => {
              onFormValueChange?.('category', newValue?._id)
            }}
            isOptionEqualToValue={(option, value) => option._id === value?._id}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} required size='medium' label='Category' />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            disabled={author.isLoading || isDetail || isLoading}
            fullWidth
            disableClearable={!!currAuthor}
            value={currAuthor}
            options={author.data}
            onChange={(_, newValue) => {
              onFormValueChange?.('author', newValue?._id)
            }}
            isOptionEqualToValue={(option, value) => option._id === value?._id}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} required size='medium' label='Author' />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            disabled={isLoading}
            size='medium'
            type='number'
            label='Quantity'
            placeholder='Enter Quantity'
            value={formValue.quantity}
            onChange={(e) => onFormValueChange?.('quantity', e.target.value)}
            InputProps={{ readOnly: isDetail }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            disabled={isLoading}
            size='medium'
            label='Publisher'
            placeholder='Enter Publisher'
            value={formValue.publisher}
            onChange={(e) => onFormValueChange?.('publisher', e.target.value)}
            InputProps={{ readOnly: isDetail }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            disabled={isLoading}
            type='date'
            size='medium'
            label='Publish Date'
            value={formValue.publishDate}
            onChange={(e) => onFormValueChange?.('publishDate', e.target.value)}
            InputProps={{ readOnly: isDetail }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            disabled={isLoading}
            multiline
            minRows={5}
            size='medium'
            label='Description'
            placeholder='Enter Description'
            value={formValue.description}
            onChange={(e) => onFormValueChange?.('description', e.target.value)}
            InputProps={{ readOnly: isDetail }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

const MemorizedBookInput = memo(BookInput, (prev, next) => {
  return (
    prev.formValue === next.formValue &&
    prev.isLoading === next.isLoading &&
    prev.error === next.error
  )
})

export default MemorizedBookInput
