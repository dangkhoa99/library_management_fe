import FormWrapper from '@/common/components/FormWrapper'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  defaultCategoryFormValue,
} from '@/common/constants'
import { loadLS, setCategoryFormValueHelper } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { FC, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CategoryInput from './CategoryInput'
import { ICategoryFormValue } from '@/common/interfaces'

const CategoryCreate: FC<{}> = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [createLoading, setCreateLoading] = useState(false)
  const [formValue, setFormValue] = useState<ICategoryFormValue>(
    defaultCategoryFormValue,
  )
  const [error, setError] = useState<string | undefined>('')

  const onFormValueChange = useCallback((key: string, value: any) => {
    setError(undefined)
    setCategoryFormValueHelper(key, value, setFormValue)
  }, [])

  const handleSubmit = () => {
    if (!formValue.name) {
      setError('Name is required')
      return
    }

    const token = loadLS('token')

    if (!token) return

    setCreateLoading(true)

    axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.CATEGORY}`,
      data: { name: formValue.name },
    })
      .then(() => {
        enqueueSnackbar('Create Category Success', { variant: 'success' })
        navigate(`/${Routes.CATEGORY}`)
      })
      .catch((err) => console.error(`[ERROR][Category]`, err))
      .finally(() => setCreateLoading(false))
  }

  return (
    <FormWrapper
      isLoading={createLoading}
      openBottomAction
      actionTxt='Create'
      handleAction={handleSubmit}
      handleCancel={() => navigate(`/${Routes.CATEGORY}`)}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
            sx={{ textTransform: 'capitalize' }}>
            New Category
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <CategoryInput
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

export default CategoryCreate
