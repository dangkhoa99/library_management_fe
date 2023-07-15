import { ILoginFormValue } from '@/common/interfaces'
import { useAuth } from '@/hooks/useAuth'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  Alert,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { FC, useCallback, useState } from 'react'

const Login: FC<{}> = () => {
  const { login } = useAuth()

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [formValue, setFormValue] = useState<ILoginFormValue>({
    username: '',
    password: '',
  })
  const [error, setError] = useState<string | undefined>('')

  const toggleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev)
  }, [])

  const onFormChangeValue = useCallback((key: string, value: any) => {
    setError(undefined)
    setFormValue((prev) => ({
      ...prev,
      [key]: value.target.value,
    }))
  }, [])

  const handleLogin = useCallback(() => {
    if (!formValue.username || !formValue.password) {
      setError('Please enter username and password')
      return
    }

    login(formValue, setError)
  }, [formValue, login])

  const handlePressEnter = useCallback(
    (e: any) => {
      if (e.key !== 'Enter') return

      handleLogin()
    },
    [handleLogin],
  )

  return (
    <Container fixed sx={{ height: '100%' }}>
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        sx={{ height: '100%' }}>
        <Grid
          item
          container
          gap={3}
          sx={{ width: '80%', minWidth: 320, maxWidth: 550 }}>
          <Grid item xs={12}>
            <Typography
              variant='h3'
              fontWeight={900}
              sx={{ textTransform: 'uppercase' }}>
              Khoa Library
            </Typography>
          </Grid>

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
              required
              size='medium'
              value={formValue.username}
              onChange={(e) => onFormChangeValue('username', e)}
              label='Username'
              placeholder='Enter your username'
              onKeyUp={handlePressEnter}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              size='medium'
              type={isShowPassword ? 'text' : 'password'}
              value={formValue.password}
              onChange={(e) => onFormChangeValue('password', e)}
              label='Password'
              placeholder='Enter your password'
              onKeyUp={handlePressEnter}
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

          <Grid item xs={12}>
            <Button
              fullWidth
              disableElevation
              variant='contained'
              size='large'
              sx={{ fontSize: 16, fontWeight: 900, color: '#fff' }}
              onClick={handleLogin}>
              Login
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Login
