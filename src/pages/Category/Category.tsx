import Table from '@/common/components/Table'
import { RestEndpoints } from '@/common/constants'
import { MRT_ColumnDef } from 'material-react-table'
import { FC, useMemo } from 'react'

const Category: FC<{}> = () => {
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [{ accessorKey: 'name', header: 'Name', size: 320 }],
    [],
  )

  return (
    <Table url={RestEndpoints.CATEGORY} columns={columns} keyDelete='name' />
  )
}

export default Category
