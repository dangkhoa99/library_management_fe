import { Genders } from '@/common/constants'
import { IUserFormValue } from '@/common/interfaces'
import {
  Alert,
  Autocomplete,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material'
import { FC, memo, useCallback, useMemo, useState } from 'react'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const LibrarianInput: FC<{
  formValue: IUserFormValue
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
  isUpdate = false,
  error = undefined,
}) => {
  const [isShowPassword, setIsShowPassword] = useState(false)

  const currGender = useMemo(
    () => Genders.ARRAY.find((item) => item.code === formValue.gender) || null,
    [formValue.gender],
  )

  const toggleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev)
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
            label='Username'
            placeholder='Enter Username'
            value={formValue.username}
            onChange={(e) => onFormValueChange?.('username', e.target.value)}
            InputProps={{ readOnly: isDetail || isUpdate }}
          />
        </Grid>

        {!isDetail && !isUpdate && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              disabled={isLoading}
              required
              size='medium'
              type={isShowPassword ? 'text' : 'password'}
              value={formValue.password}
              onChange={(e) => onFormValueChange?.('password', e.target.value)}
              label='Password'
              placeholder='Enter password'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <Tooltip
                      title={
                        isShowPassword ? 'Hide password' : 'Show password'
                      }>
                      <span>
                        <IconButton onClick={toggleShowPassword} edge='end'>
                          {isShowPassword ? (
                            <VisibilityOff fontSize='medium' />
                          ) : (
                            <Visibility fontSize='medium' />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
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
            disabled={isDetail || isLoading}
            fullWidth
            disableClearable={!!currGender}
            value={currGender}
            options={Genders.ARRAY}
            onChange={(_, newValue) => {
              onFormValueChange?.('gender', newValue?.code)
            }}
            isOptionEqualToValue={(option, value) =>
              option.code === value?.code
            }
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} size='medium' label='Gender' />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            disabled={isLoading}
            size='medium'
            label='Phone'
            placeholder='Enter Phone'
            value={formValue.phone}
            onChange={(e) => onFormValueChange?.('phone', e.target.value)}
            InputProps={{ readOnly: isDetail }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            disabled={isLoading}
            size='medium'
            label='Email'
            placeholder='Enter Email'
            value={formValue.email}
            onChange={(e) => onFormValueChange?.('email', e.target.value)}
            InputProps={{ readOnly: isDetail }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            disabled={isLoading}
            size='medium'
            label='Address'
            placeholder='Enter Address'
            value={formValue.address}
            onChange={(e) => onFormValueChange?.('address', e.target.value)}
            InputProps={{ readOnly: isDetail }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

const MemorizedLibrarianInput = memo(LibrarianInput, (prev, next) => {
  return (
    prev.formValue === next.formValue &&
    prev.isLoading === next.isLoading &&
    prev.error === next.error
  )
})

export default MemorizedLibrarianInput
