import { useAuth } from '@/hooks'
import { Navigate, useOutlet } from 'react-router-dom'
import { Fragment, useEffect } from 'react'
import { Routes } from '@/common/constants'

const MainLayout = () => {
  const { authenticated, checkAuth } = useAuth()

  const outlet = useOutlet()

  useEffect(() => {
    checkAuth()

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!authenticated) {
    return <Navigate to={`/${Routes.LOGIN}`} />
  }

  return <Fragment>{outlet}</Fragment>
}

export default MainLayout
