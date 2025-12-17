import { useCallback, useMemo, memo } from "react"
import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community"
import type { Trade } from "../types/Trade"
import { Container } from "./Trades.styled"
import { amountFormatter, priceFormatter, timeFormatter } from "@modules/ag-grid/formatter"
import Palette from "@theme/style"
import { useThrottle } from "@core/hooks/useThrottle"

export interface Props {
  trades: Trade[]
}

const Trades = memo(({ trades }: Props) => {
  const throttledTrades = useThrottle<Trade[]>(trades, 100)
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "Id",
        field: "id",
        hide: true,
      },
      {
        headerName: "Amount",
        field: "amount",
        width: 160,
        valueFormatter: (params) => amountFormatter({ value: Math.abs(params.value) }),
      },
      {
        headerName: "Price",
        field: "price",
        width: 160,
        cellStyle: (params) => {
          return {
            color: params.value < 0 ? Palette.Ask : Palette.Bid,
          }
        },
        valueFormatter: priceFormatter,
      },
      {
        headerName: "Time",
        field: "timestamp",
        width: 160,
        valueFormatter: timeFormatter,
        cellStyle: () => ({
          color: Palette.LightGray,
        }),
      },
    ],
    []
  )

  const getRowId = useCallback((params: any) => `${params.data.id}`, [])

  return (
    <Container className="ag-theme-quartz-dark">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={throttledTrades}
        getRowId={getRowId}
        suppressHorizontalScroll={true}
        gridOptions={{ localeText: { noRowsToShow: "Loading..." } }}
      ></AgGridReact>
    </Container>
  )
})

export default Trades
