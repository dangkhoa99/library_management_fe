import { BASE_URL, RestEndpoints, Roles, Routes } from '@/common/constants'
import { loadLS, removeLS, saveLS } from '@/utils'
import { AuthContext } from '@/context/AuthContext'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { useSnackbar } from 'notistack'
import { FC, ReactNode, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ILoginFormValue } from '@/common/interfaces'

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [authenticated, setAuthenticated] = useState(() => loadLS('token'))

  const login = (
    data: ILoginFormValue,
    setError?: (message: string) => void,
  ) => {
    axios({
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      url: `${BASE_URL}/${RestEndpoints.LOGIN}`,
      data,
    })
      .then((res) => {
        if (!res.data || !res.data.role) return

        if (
          res.data.role !== Roles.SUPER_ADMIN &&
          res.data.role !== Roles.ADMIN &&
          res.data.role !== Roles.MANAGER
        ) {
          setError?.('Your account does not have permission to login')
          return
        }

        const token = saveLS('token', res.data.token)

        setAuthenticated(token)

        navigate('/', { replace: true })
      })
      .catch(
        (err) => setError?.(err?.response?.data?.message || 'Login Failed'),
      )
  }

  const logout = () => {
    removeLS('token')
    setAuthenticated(false)
    navigate(`/${Routes.LOGIN}`, { replace: true })
    enqueueSnackbar('Logout success', { variant: 'success' })
  }

  const checkAuth = () => {
    const token = loadLS('token')

    if (!token) {
      setAuthenticated(false)
      navigate(`/${Routes.LOGIN}`, { replace: true })
      return
    }

    const decoded: any = jwtDecode(token.value)

    const { exp } = decoded

    const expirationTime = exp * 1000

    if (Date.now() >= expirationTime) {
      removeLS('token')
      setAuthenticated(false)
      navigate(`/${Routes.LOGIN}`, { replace: true })
    }
  }

  const value = useMemo(
    () => ({
      authenticated,
      login,
      logout,
      checkAuth,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
