import { BASE_URL, TableStyle } from '@/common/constants'
import { loadLS } from '@/utils'
import { Delete, Edit } from '@mui/icons-material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, Button, Grid, IconButton, Tooltip } from '@mui/material'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MRT_TableInstance,
} from 'material-react-table'
import { useSnackbar } from 'notistack'
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import BasicModal from './BasicModal'

const Table: FC<{
  url?: string
  columns?: MRT_ColumnDef<any>[]
  keyDelete?: string
  disabledDelete?: boolean
}> = ({
  url = '',
  columns = [],
  keyDelete = '_id',
  disabledDelete = false,
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const tableInstanceRef = useRef<MRT_TableInstance<any>>(null)
  const token = useMemo(() => loadLS('token'), [])
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})
  const [refetchDataTable, setRefetchDataTable] = useState(0)

  const [data, setData] = useState({
    list: [],
    isLoading: false,
  })

  const handleDeleteItem = useCallback(
    (opts: { id: string; isMany?: boolean }) => {
      const { id, isMany = false } = opts

      if (!token || disabledDelete) return

      const _url = url.split('/')[0]

      axios({
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token?.type} ${token?.value}`,
        },
        url: `${BASE_URL}/${_url}/${id}`,
      })
        .then((res) => {
          console.log(`[DELETE][${_url}]`, res.data)

          if (isMany) return
          setRefetchDataTable((prev) => prev + 1)
          enqueueSnackbar('Delete Success', { variant: 'success' })
        })
        .catch((err) => {
          console.error(`[ERROR]DELETE][${_url}]`, err)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const handleDeleteItems = useCallback(() => {
    const arrIds =
      tableInstanceRef.current?.getSelectedRowModel().flatRows ?? []

    arrIds.forEach((item) => handleDeleteItem({ id: item.id, isMany: true }))

    setRefetchDataTable((prev) => prev + 1)

    enqueueSnackbar(
      `Delete ${tableInstanceRef.current?.getSelectedRowModel().flatRows
        .length} Items Success`,
      { variant: 'success' },
    )

    tableInstanceRef.current?.resetRowSelection()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!token) return

    setData((prev) => ({ ...prev, isLoading: true }))

    axios({
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token?.type} ${token?.value}`,
      },
      url: `${BASE_URL}/${url}`,
    })
      .then((res) => {
        console.log(`[GET][${url}]`, res.data)

        setData({ list: res.data, isLoading: false })
      })
      .catch((err) => console.error(`[ERROR][GET][${url}]`, err))
      .finally(() => setData((prev) => ({ ...prev, isLoading: false })))

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchDataTable])

  useEffect(() => {
    tableInstanceRef.current?.setRowSelection(rowSelection)

    return () => {}
  }, [rowSelection])

  return (
    <Grid container justifyContent='center' sx={{ width: '100%' }}>
      <MaterialReactTable
        tableInstanceRef={tableInstanceRef}
        getRowId={(originalRow: any, index: number) =>
          originalRow?._id || index
        }
        columns={columns}
        data={data.list}
        enableRowSelection
        enableRowActions
        enableColumnFilterModes
        enableColumnOrdering
        enableColumnResizing
        enableColumnFilters
        enableStickyHeader
        enableStickyFooter
        enablePinning
        enableFilterMatchHighlighting
        initialState={{ density: 'comfortable' }}
        state={{ isLoading: data.isLoading, rowSelection }}
        onRowSelectionChange={setRowSelection}
        positionToolbarAlertBanner='bottom'
        globalFilterFn='contains'
        renderRowActions={({ row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}>
            <Tooltip arrow placement='left' title='Detail'>
              <IconButton onClick={() => navigate(`./${row.id}/show`)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            <Tooltip arrow placement='bottom' title='Edit'>
              <IconButton
                color='primary'
                onClick={() => navigate(`./${row.id}/edit`)}>
                <Edit />
              </IconButton>
            </Tooltip>

            {!disabledDelete && (
              <BasicModal
                modalTitle='Are you sure you want to delete this item?'
                modalContent={`Item: ${row?.original?.[keyDelete]}`}
                modalActionFunc={() => handleDeleteItem({ id: row.id })}
                btnLayout={(props) => (
                  <Tooltip arrow placement='right' title='Delete'>
                    <IconButton
                      color='error'
                      onClick={() => props?.openModal?.()}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                )}
              />
            )}
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}>
            <Button
              disableElevation
              variant='outlined'
              color='primary'
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => navigate('./new')}
              sx={{ fontWeight: 900, minWidth: 150 }}>
              New
            </Button>

            {!disabledDelete && (
              <BasicModal
                modalTitle='Are you sure you want to delete some items?'
                modalContent={'Items:'}
                modalContentArr={tableInstanceRef.current
                  ?.getSelectedRowModel()
                  .flatRows.map((item) => {
                    const original: any = item.original
                    return original?.[keyDelete]
                  })}
                modalActionFunc={handleDeleteItems}
                btnLayout={({ openModal }) => (
                  <Button
                    disabled={isEmpty(rowSelection)}
                    disableElevation
                    variant='outlined'
                    color='error'
                    startIcon={<Delete />}
                    onClick={openModal}
                    sx={{ fontWeight: 900, minWidth: 150 }}>
                    Delete{' '}
                    {`(${
                      tableInstanceRef.current?.getSelectedRowModel().flatRows
                        .length ?? 0
                    })`}
                  </Button>
                )}
              />
            )}
          </Box>
        )}
        displayColumnDefOptions={{
          'mrt-row-actions': {
            size: 160,
            muiTableHeadCellProps: { align: 'center' },
          },
        }}
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
  )
}

const MemorizedTable = memo(Table)

export default MemorizedTable
