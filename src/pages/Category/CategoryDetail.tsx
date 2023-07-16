import FormWrapper from '@/common/components/FormWrapper'
import Loading from '@/common/components/Loading'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  defaultCategoryFormValue,
} from '@/common/constants'
import { loadLS } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CategoryInput from './CategoryInput'
import { ICategoryFormValue } from '@/common/interfaces'

const CategoryDetail: FC<{}> = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [formValue, setFormValue] = useState<ICategoryFormValue>(
    defaultCategoryFormValue,
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
      url: `${BASE_URL}/${RestEndpoints.CATEGORY}/${id}`,
    })
      .then((res) => setFormValue({ ...res.data }))
      .catch((err) => console.error(`[ERROR][Category]`, err))
      .finally(() => setIsLoading(false))

    return () => {}
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FormWrapper
      actionTxt='Edit'
      handleAction={() => navigate(`/${Routes.CATEGORY}/${id}/edit`)}
      handleCancel={() => navigate(`/${Routes.CATEGORY}`)}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
            sx={{ textTransform: 'capitalize' }}>
            Detail Category
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <CategoryInput isDetail formValue={formValue} isLoading={isLoading} />
        </Grid>
      </Grid>
    </FormWrapper>
  )
}

export default CategoryDetail
