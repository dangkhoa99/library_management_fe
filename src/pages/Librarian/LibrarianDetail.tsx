import FormWrapper from '@/common/components/FormWrapper'
import Loading from '@/common/components/Loading'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  defaultLibrarianFormValue,
} from '@/common/constants'
import { loadLS } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LibrarianInput from './LibrarianInput'
import { IUserFormValue } from '@/common/interfaces'

const LibrarianDetail: FC<{}> = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formValue, setFormValue] = useState<IUserFormValue>(
    defaultLibrarianFormValue,
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
        const value = { ...res.data, username: res.data.account.username }
        setFormValue(value)
      })
      .catch((err) => console.error(`[ERROR][Librarian]`, err))
      .finally(() => setIsLoading(false))

    return () => {}
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FormWrapper
      actionTxt='Edit'
      handleAction={() => navigate(`/${Routes.LIBRARIAN}/${id}/edit`)}
      handleCancel={() => navigate(`/${Routes.LIBRARIAN}`)}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
            sx={{ textTransform: 'capitalize' }}>
            Detail Librarian
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <LibrarianInput
            isDetail
            formValue={formValue}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </FormWrapper>
  )
}

export default LibrarianDetail
