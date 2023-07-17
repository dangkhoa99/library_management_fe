import {
  BASE_URL,
  RestEndpoints,
  Statuses,
  TableStyle,
} from '@/common/constants'
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
  Button,
  Checkbox,
  Chip,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { FC, memo, useEffect, useMemo, useState } from 'react'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import dayjs from 'dayjs'
import { BasicModal } from '@/common/components'

const BorrowInput: FC<{
  formValue: IBorrowFormValue
  onFormValueChange?: (key: string, value: any) => void
  isLoading?: boolean
  isDetail?: boolean
  isUpdate?: boolean
  error?: string
  submitReturnBook?: () => void
}> = ({
  formValue,
  onFormValueChange = undefined,
  isLoading = false,
  isDetail = false,
  isUpdate = false,
  error = undefined,
  submitReturnBook,
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
      { accessorKey: 'bookInfo.name', header: 'Book', size: 320 },
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
    if (isDetail || isUpdate) {
      setCurrentLibrarian((prev) => ({
        ...prev,
        data: formValue.librarianInfo,
      }))
      return
    }

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

  useEffect(() => {
    if (isDetail || isUpdate) return
    onFormValueChange?.('borrowDate', dayjs().format('YYYY-MM-DD'))
    onFormValueChange?.('returnDate', dayjs().format('YYYY-MM-DD'))

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

        {(isDetail || isUpdate) && formValue.status && (
          <Grid
            item
            xs={12}
            container
            alignItems='center'
            sx={{ textAlign: 'start' }}>
            <Grid item xs={6}>
              <Typography
                component='span'
                variant='h6'
                sx={{ fontWeight: 900, pr: 3 }}>
                Status
              </Typography>

              <Chip
                label={Statuses.NAME[formValue.status]}
                color={Statuses.COLOR[formValue.status]}
                size='medium'
                sx={{ fontSize: 16, fontWeight: 900 }}
              />
            </Grid>

            {isUpdate && formValue.status !== Statuses.RETURNED && (
              <Grid item xs={6} sx={{ textAlign: 'end' }}>
                <BasicModal
                  modalTitle='Are you sure you want confirm the RETURNED status of this ticket?'
                  modalActionFunc={() => submitReturnBook?.()}
                  btnLayout={({ openModal }) => (
                    <Button
                      disabled={isLoading}
                      disableElevation
                      variant='contained'
                      size='medium'
                      color={Statuses.COLOR[Statuses.RETURNED]}
                      onClick={openModal}
                      sx={{
                        fontSize: 16,
                        fontWeight: 900,
                        textTransform: 'capitalize',
                      }}>
                      {Statuses.NAME[Statuses.RETURNED]}
                    </Button>
                  )}
                />
              </Grid>
            )}
          </Grid>
        )}

        <Grid item xs={3} container rowSpacing={3} alignContent='start'>
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
              disabled={isDetail || isUpdate || isLoading}
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
              InputProps={{ readOnly: isDetail || isUpdate }}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: dayjs().format('YYYY-MM-DD') }}
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
              InputProps={{ readOnly: isDetail || isUpdate }}
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
              InputProps={{
                readOnly: isDetail || formValue.status === Statuses.RETURNED,
              }}
            />
          </Grid>
        </Grid>

        <Grid item xs={9} container rowSpacing={3} alignContent='start'>
          <Grid item xs={12}>
            <Autocomplete
              disabled={isLoading || book.isLoading || isDetail || isUpdate}
              fullWidth
              multiple
              disableCloseOnSelect
              limitTags={5}
              value={formValue.books?.map((item) => item.bookInfo)}
              onChange={(_, newValue) => {
                onFormValueChange?.('books', newValue)
              }}
              options={book.data}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option._id === value?._id
              }
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
                  placeholder={!isDetail && !isUpdate ? 'Enter Book Name' : ''}
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
