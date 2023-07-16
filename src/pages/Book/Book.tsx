import Table from '@/common/components/Table'
import { RestEndpoints } from '@/common/constants'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { MRT_ColumnDef } from 'material-react-table'
import { FC, useMemo } from 'react'

const Book: FC<{}> = () => {
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', size: 320 },
      { accessorKey: 'category.name', header: 'Category', size: 160 },
      { accessorKey: 'author.name', header: 'Author', size: 160 },
      { accessorKey: 'publisher', header: 'Publisher', size: 160 },
      {
        accessorKey: 'publishDate',
        header: 'Publish Date',
        size: 160,
        Cell: ({ cell }) => (
          <Box>{dayjs(`${cell.getValue()}`).format('YYYY-MM-DD')}</Box>
        ),
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        size: 160,
        filterFn: 'between',
        Cell: ({ cell }) => <Box>{`${cell.getValue()}`}</Box>,
      },
    ],
    [],
  )

  return <Table url={RestEndpoints.BOOK} columns={columns} keyDelete='name' />
}

export default Book
