import Table from '@/common/components/Table'
import { RestEndpoints } from '@/common/constants'
import { Typography } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { FC, useMemo } from 'react'

const Category: FC<{}> = () => {
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', size: 160 },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 320,
        Cell: ({ cell }) => (
          <Typography noWrap variant='inherit'>
            {`${cell.getValue() ?? ''}`}
          </Typography>
        ),
      },
    ],
    [],
  )

  return (
    <Table url={RestEndpoints.CATEGORY} columns={columns} keyDelete='name' />
  )
}

export default Category
