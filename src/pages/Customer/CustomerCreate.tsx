import FormWrapper from '@/common/components/FormWrapper'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  defaultCustomerFormValue,
} from '@/common/constants'
import { loadLS, setCustomerFormValueHelper } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerInput from './CustomerInput'
import { FC } from 'react'
import { IUserFormValue } from '@/common/interfaces'

const CustomerCreate: FC<{}> = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [createLoading, setCreateLoading] = useState(false)
  const [formValue, setFormValue] = useState<IUserFormValue>(
    defaultCustomerFormValue,
  )
  const [error, setError] = useState<string | undefined>('')

  const onFormValueChange = useCallback((key: string, value: any) => {
    setError(undefined)
    setCustomerFormValueHelper(key, value, setFormValue)
  }, [])

  const handleSubmit = () => {
    const token = loadLS('token')

    if (!token) return

    // Validation form
    if (!formValue.name) {
      setError('Name is required')
      return
    }

    setCreateLoading(true)

    axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.CUSTOMER}`,
      data: { ...formValue },
    })
      .then(() => {
        enqueueSnackbar('Create Customer Success', { variant: 'success' })
        navigate(`/${Routes.CUSTOMER}`)
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
      handleCancel={() => navigate(`/${Routes.CUSTOMER}`)}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
            sx={{ textTransform: 'capitalize' }}>
            New Customer
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <CustomerInput
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

export default CustomerCreate
