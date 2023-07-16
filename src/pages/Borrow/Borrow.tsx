import Table from '@/common/components/Table'
import { RestEndpoints, Statuses } from '@/common/constants'
import { Box, Chip } from '@mui/material'
import dayjs from 'dayjs'
import { MRT_ColumnDef } from 'material-react-table'
import { FC, useMemo } from 'react'

const Borrow: FC = () => {
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { accessorKey: '_id', header: 'ID', size: 160 },
      { accessorKey: 'librarian.name', header: 'Librarian', size: 160 },
      { accessorKey: 'customer.name', header: 'Member', size: 160 },
      {
        accessorKey: 'borrowDate',
        header: 'Borrow Date',
        size: 160,
        Cell: ({ cell }) => (
          <Box>{dayjs(`${cell.getValue()}`).format('YYYY-MM-DD')}</Box>
        ),
      },
      {
        accessorKey: 'returnDate',
        header: 'Return Date',
        size: 160,
        Cell: ({ cell }) => (
          <Box>{dayjs(`${cell.getValue()}`).format('YYYY-MM-DD')}</Box>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 160,
        Cell: ({ cell }) => {
          const value = `${cell.getValue()}`

          return (
            <Chip
              label={Statuses.NAME[value]}
              size='small'
              color={value ? Statuses.COLOR[value] : 'default'}
              sx={{ fontWeight: '900', minWidth: '80px' }}
            />
          )
        },
      },
    ],
    [],
  )

  return <Table url={RestEndpoints.BORROW} columns={columns} disabledDelete />
}

export default Borrow
