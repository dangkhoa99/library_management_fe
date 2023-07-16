import FormWrapper from '@/common/components/FormWrapper'
import Loading from '@/common/components/Loading'
import {
  BASE_URL,
  RestEndpoints,
  Routes,
  defaultLibrarianFormValue,
} from '@/common/constants'
import { diffObject, loadLS, setLibrarianFormValueHelper } from '@/utils'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LibrarianInput from './LibrarianInput'
import { IUserFormValue } from '@/common/interfaces'

const LibrarianUpdate: FC<{}> = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useMemo(() => loadLS('token'), [])

  const [originalFormValue, setOriginalFormValue] = useState<IUserFormValue>(
    defaultLibrarianFormValue,
  )
  const [formValue, setFormValue] = useState<IUserFormValue>(
    defaultLibrarianFormValue,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>('')

  const onFormValueChange = useCallback((key: string, value: any) => {
    setError(undefined)
    setLibrarianFormValueHelper(key, value, setFormValue)
  }, [])

  const handleSubmit = () => {
    if (!token) return

    // Validation form
    if (!formValue.name) {
      setError('Name is required')
      return
    }

    const diff = diffObject(originalFormValue, formValue)

    if (!diff) return

    const data = { ...diff }

    setIsLoading(true)

    axios({
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.USER}/${id}`,
      data,
    })
      .then(() => {
        enqueueSnackbar('Update Librarian Success', { variant: 'success' })
        navigate(`/${Routes.LIBRARIAN}`)
      })
      .catch((_err) => {
        console.error(`[ERROR][Librarian]`, _err)
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
      url: `${BASE_URL}/${RestEndpoints.USER}/${id}`,
    })
      .then((res) => {
        const value = { ...res.data, username: res.data.account.username }
        setFormValue(value)
        setOriginalFormValue(value)
      })
      .catch((err) => {
        console.error(`[ERROR][Librarian]`, err)
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
      handleCancel={() => navigate(`/${Routes.LIBRARIAN}`)}
      disabledBtn={isLoading}
      openBottomAction>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Typography
            variant='h4'
            fontWeight={600}
            sx={{ textTransform: 'capitalize' }}>
            Edit Librarian
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <LibrarianInput
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

export default LibrarianUpdate
