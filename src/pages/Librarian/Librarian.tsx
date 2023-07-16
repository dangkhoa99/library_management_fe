import Table from '@/common/components/Table'
import { Genders, RestEndpoints } from '@/common/constants'
import { Box } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { FC, useMemo } from 'react'

const Librarian: FC<{}> = () => {
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { accessorKey: 'account.username', header: 'Username', size: 160 },
      { accessorKey: 'name', header: 'Name', size: 160 },
      { accessorKey: 'phone', header: 'Phone', size: 160 },
      { accessorKey: 'email', header: 'Email', size: 320 },
      {
        accessorKey: 'gender',
        header: 'Gender',
        size: 160,
        Cell: ({ cell }) => <Box>{Genders.NAME[`${cell.getValue()}`]}</Box>,
      },
    ],
    [],
  )

  return (
    <Table url={RestEndpoints.LIBRARIAN} columns={columns} keyDelete='name' />
  )
}

export default Librarian
