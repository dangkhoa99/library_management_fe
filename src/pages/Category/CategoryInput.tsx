import { ICategoryFormValue } from '@/common/interfaces'
import { Alert, Box, Grid, TextField } from '@mui/material'
import { FC, memo } from 'react'

const CategoryInput: FC<{
  formValue: ICategoryFormValue
  onFormValueChange?: (key: string, value: any) => void
  isLoading?: boolean
  isDetail?: boolean
  isUpdate?: boolean
  error?: string
}> = ({
  formValue,
  onFormValueChange,
  isLoading = false,
  isDetail = false,
  error = undefined,
}) => {
  return (
    <Box sx={{ width: '50%', m: '0 auto' }}>
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
            label='Name'
            placeholder='Enter Name'
            value={formValue.name}
            onChange={(e) => onFormValueChange?.('name', e.target.value)}
            InputProps={{ readOnly: isDetail }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

const MemorizedCategoryInput = memo(CategoryInput, (prev, next) => {
  return (
    prev.formValue === next.formValue &&
    prev.isLoading === next.isLoading &&
    prev.error === next.error
  )
})

export default MemorizedCategoryInput
