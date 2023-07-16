import { Button, CircularProgress, Grid, Paper } from '@mui/material'
import { FC, ReactNode } from 'react'

const FormWrapper: FC<{
  isLoading?: boolean
  children: ReactNode
  handleAction: () => void
  handleCancel: () => void
  cancelTxt?: string
  actionTxt?: string
  openBottomAction?: boolean
  disabledBtn?: boolean
  showActionBtn?: boolean
}> = ({
  isLoading = false,
  children,
  handleAction,
  handleCancel,
  cancelTxt = 'Back',
  actionTxt = '',
  openBottomAction = false,
  disabledBtn = false,
  showActionBtn = true,
}) => {
  return (
    <Paper
      variant='outlined'
      sx={{
        width: '100%',
        height: 'calc(100% - 64px)',
        overflow: 'hidden',
      }}>
      <Grid
        container
        direction='column'
        wrap='nowrap'
        sx={{ width: '100%', height: '100%' }}>
        <Grid
          item
          container
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          sx={{
            flex: '0 !important',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'grey.300',
          }}>
          <Button
            disabled={disabledBtn || isLoading}
            disableElevation
            variant='outlined'
            onClick={handleCancel}
            sx={{ minWidth: 100, fontWeight: 900 }}>
            {cancelTxt}
          </Button>

          {showActionBtn && (
            <Button
              disabled={disabledBtn || isLoading}
              disableElevation
              variant='contained'
              onClick={handleAction}
              sx={{ minWidth: 100, fontWeight: 900, color: '#fff' }}>
              {isLoading ? (
                <CircularProgress size={25} color='inherit' />
              ) : (
                actionTxt
              )}
            </Button>
          )}
        </Grid>

        <Grid item sx={{ height: '100%', overflow: 'overlay', py: 2 }}>
          {children}
        </Grid>

        {openBottomAction && (
          <Grid
            item
            container
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            sx={{
              flex: '0 !important',
              p: 2,
              borderTop: '1px solid',
              borderColor: 'grey.300',
            }}>
            <Button
              disabled={disabledBtn || isLoading}
              disableElevation
              variant='outlined'
              onClick={handleCancel}
              sx={{ minWidth: 100, fontWeight: 900 }}>
              {cancelTxt}
            </Button>

            {showActionBtn && (
              <Button
                disabled={disabledBtn || isLoading}
                disableElevation
                variant='contained'
                onClick={handleAction}
                sx={{ minWidth: 100, fontWeight: 900, color: '#fff' }}>
                {isLoading ? (
                  <CircularProgress size={25} color='inherit' />
                ) : (
                  actionTxt
                )}
              </Button>
            )}
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}

export default FormWrapper
