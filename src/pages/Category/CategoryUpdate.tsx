import FormWrapper from '@/common/components/FormWrapper'
import Loading from '@/common/components/Loading'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  defaultCategoryFormValue,
} from '@/common/constants'
import { diffObject, loadLS, setCategoryFormValueHelper } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CategoryInput from './CategoryInput'

const CategoryUpdate = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useMemo(() => loadLS('token'), [])

  const [originalFormValue, setOriginalFormValue] = useState(
    defaultCategoryFormValue,
  )
  const [formValue, setFormValue] = useState(defaultCategoryFormValue)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>('')

  const onFormValueChange = useCallback((key: string, value: any) => {
    setError(undefined)
    setCategoryFormValueHelper(key, value, setFormValue)
  }, [])

  const handleSubmit = () => {
    // Validation form
    if (!formValue.name) {
      setError('Name is required')
      return
    }

    if (!token) return

    const diff = diffObject(originalFormValue, formValue)

    // console.log('[originalFormValue]', originalFormValue)
    // console.log('[formValue]', formValue)
    console.log('[DIFF]', diff)

    if (!diff) return

    setIsLoading(true)

    axios({
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.CATEGORY}/${id}`,
      data: diff,
    })
      .then(() => {
        enqueueSnackbar('Update Category Success', { variant: 'success' })
        navigate(`/${Routes.CATEGORY}`)
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
      url: `${BASE_URL}/${RestEndpoints.CATEGORY}/${id}`,
    })
      .then((res) => {
        const value = res.data
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
      handleCancel={() => navigate(`/${Routes.CATEGORY}`)}
      disabledBtn={isLoading}
      openBottomAction>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
            sx={{ textTransform: 'capitalize' }}>
            Edit Category
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <CategoryInput
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

export default CategoryUpdate
