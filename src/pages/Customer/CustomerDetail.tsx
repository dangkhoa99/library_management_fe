import FormWrapper from '@/common/components/FormWrapper'
import Loading from '@/common/components/Loading'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  defaultCustomerFormValue,
} from '@/common/constants'
import { loadLS } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CustomerInput from './CustomerInput'
import { IUserFormValue } from '@/common/interfaces'

const CustomerDetail: FC<{}> = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formValue, setFormValue] = useState<IUserFormValue>(
    defaultCustomerFormValue,
  )
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
      url: `${BASE_URL}/${RestEndpoints.USER}/${id}`,
    })
      .then((res) => {
        const value = { ...res.data }
        setFormValue(value)
      })
      .catch((err) => console.error(`[ERROR][Customer]`, err))
      .finally(() => setIsLoading(false))

    return () => {}
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FormWrapper
      actionTxt='Edit'
      handleAction={() => navigate(`/${Routes.CUSTOMER}/${id}/edit`)}
      handleCancel={() => navigate(`/${Routes.CUSTOMER}`)}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
            sx={{ textTransform: 'capitalize' }}>
            Detail Customer
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <CustomerInput isDetail formValue={formValue} isLoading={isLoading} />
        </Grid>
      </Grid>
    </FormWrapper>
  )
}

export default CustomerDetail
