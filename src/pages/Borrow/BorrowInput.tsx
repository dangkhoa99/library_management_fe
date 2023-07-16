import { BASE_URL, RestEndpoints, TableStyle } from '@/common/constants'
import {
  IBook,
  IBorrowFormValue,
  IGetList,
  IGetOne,
  IUser,
} from '@/common/interfaces'
import { loadLS } from '@/utils'
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Checkbox,
  Grid,
  TextField,
} from '@mui/material'
import axios from 'axios'
import { FC, memo, useEffect, useMemo, useState } from 'react'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import dayjs from 'dayjs'

const BorrowInput: FC<{
  formValue: IBorrowFormValue
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
  error = undefined,
}) => {
  const token = useMemo(() => loadLS('token'), [])

  const [book, setBook] = useState<IGetList<IBook>>({
    data: [],
    isLoading: false,
  })

  const [member, setMember] = useState<IGetList<IUser>>({
    data: [],
    isLoading: false,
  })

  const [currentLibrarian, setCurrentLibrarian] = useState<IGetOne<IUser>>({
    data: undefined,
    isLoading: false,
  })

  const currMember = useMemo(
    () => member.data.find((item) => item._id === formValue.customer) || null,
    [formValue.customer, member.data],
  )

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'bookInfo.image.link',
        header: 'Image',
        size: 50,
        Cell: ({ cell }) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Avatar
              sx={{ width: 50, height: 50 }}
              variant='rounded'
              src={`${cell.getValue()}`}
            />
          </Box>
        ),
      },
      { accessorKey: 'bookInfo.name', header: 'Book', size: 160 },
      { accessorKey: 'bookInfo.author.name', header: 'Author', size: 160 },
      { accessorKey: 'bookInfo.category.name', header: 'Category', size: 160 },
    ],
    [],
  )

  useEffect(() => {
    if (!token) return

    setBook((prev) => ({ ...prev, isLoading: true }))

    axios({
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.BOOK}`,
    })
      .then((res) => setBook({ data: res.data, isLoading: false }))
      .catch((err) => console.error(`[ERROR][Book]`, err))
      .finally(() => setBook((prev) => ({ ...prev, isLoading: false })))

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!token) return

    setMember((prev) => ({ ...prev, isLoading: true }))

    axios({
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.CUSTOMER}`,
    })
      .then((res) => setMember({ data: res.data, isLoading: false }))
      .catch((err) => console.error(`[ERROR][User]`, err))
      .finally(() => setMember((prev) => ({ ...prev, isLoading: false })))

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const userId = loadLS('userId')

    if (!token || !userId) return

    onFormValueChange?.('librarian', userId)

    setCurrentLibrarian((prev) => ({ ...prev, isLoading: true }))

    axios({
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${RestEndpoints.USER}/${userId}`,
    })
      .then((res) => {
        const value = { ...res.data }
        setCurrentLibrarian({ data: value, isLoading: false })
      })
      .catch((err) => console.error(`[ERROR][User]`, err))
      .finally(() =>
        setCurrentLibrarian((prev) => ({ ...prev, isLoading: false })),
      )

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={{ width: '95%', m: '0 auto' }}>
      <Grid container spacing={3}>
        {error && (
          <Grid item xs={12}>
            <Alert variant='outlined' severity='error'>
              {error}
            </Alert>
          </Grid>
        )}

        <Grid item xs={6} container rowSpacing={3} alignContent='start'>
          <Grid item xs={12}>
            <TextField
              fullWidth
              disabled={isLoading || currentLibrarian.isLoading}
              required
              size='medium'
              label='Creator'
              value={currentLibrarian.data?.name ?? ''}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              disabled={isDetail || isLoading}
              fullWidth
              disableClearable={!!currMember}
              value={currMember}
              options={member.data}
              onChange={(_, newValue) => {
                onFormValueChange?.('customer', newValue?._id)
              }}
              isOptionEqualToValue={(option, value) =>
                option._id === value?._id
              }
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} required size='medium' label='Member' />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              disabled={isLoading}
              type='date'
              size='medium'
              label='Borrow Date'
              value={formValue.borrowDate || dayjs().format('YYYY-MM-DD')}
              onChange={(e) =>
                onFormValueChange?.('borrowDate', e.target.value)
              }
              InputProps={{ readOnly: isDetail }}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: dayjs().format('YYYY-MM-DD'),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              disabled={isLoading}
              type='date'
              size='medium'
              label='Return Date'
              value={formValue.returnDate || dayjs().format('YYYY-MM-DD')}
              onChange={(e) =>
                onFormValueChange?.('returnDate', e.target.value)
              }
              InputProps={{ readOnly: isDetail }}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: dayjs(formValue.borrowDate).format('YYYY-MM-DD'),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              disabled={isLoading}
              multiline
              minRows={5}
              size='medium'
              label='Note'
              placeholder='Enter Note'
              value={formValue.note}
              onChange={(e) => onFormValueChange?.('note', e.target.value)}
              InputProps={{ readOnly: isDetail }}
            />
          </Grid>
        </Grid>

        <Grid item xs={6} container rowSpacing={3} alignContent='start'>
          <Grid item xs={12}>
            <Autocomplete
              disabled={isLoading || book.isLoading}
              fullWidth
              multiple
              disableCloseOnSelect
              limitTags={3}
              onChange={(_, newValue) => {
                onFormValueChange?.('books', newValue)
              }}
              options={book.data}
              getOptionLabel={(option) => option.name}
              getOptionDisabled={(option) => option.quantity === 0}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                    checkedIcon={<CheckBoxIcon fontSize='small' />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {`${option.name} - ${option.author.name}`}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='medium'
                  label='Books'
                  placeholder='Enter Book Name'
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <MaterialReactTable
              enableColumnActions={false}
              enableColumnFilters={false}
              enablePagination={false}
              enableSorting={false}
              enableBottomToolbar={false}
              enableTopToolbar={false}
              muiTableBodyRowProps={{ hover: false }}
              data={formValue.books ?? []}
              columns={columns}
              muiTableHeadRowProps={TableStyle.muiTableHeadRowProps}
              muiTableHeadCellProps={TableStyle.muiTableHeadCellProps}
              muiTableBodyCellProps={TableStyle.muiTableBodyCellProps}
              muiTablePaperProps={{
                variant: 'outlined',
                elevation: 0,
                sx: {
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden !important',
                  display: 'flex',
                  flexDirection: 'column',
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

const MemorizedBorrowInput = memo(BorrowInput, (prev, next) => {
  return (
    prev.formValue === next.formValue &&
    prev.isLoading === next.isLoading &&
    prev.error === next.error
  )
})

export default MemorizedBorrowInput
