import { useMemo, useCallback } from "react"
import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community"
import { priceFormatter, amountFormatter } from "@modules/ag-grid/formatter"
import { Container } from "./Book.styled"
import { type Order } from "@modules/book/types/Order"
import Palette from "@theme/style"
import { bidAmountRenderer, askAmountRenderer } from "./renderers"
import { useThrottle } from "@core/hooks/useThrottle"

export interface Props {
  orders: { bid: Order; ask: Order }[]
  isStale?: boolean
}

const Book = ({ orders }: Props) => {
  const throttledOrders = useThrottle<{ bid: Order; ask: Order }[]>(orders, 100)

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "Bid Amount",
        field: "bid.amount",
        width: 145,
        valueFormatter: amountFormatter,
        cellRenderer: bidAmountRenderer,
      },
      {
        headerName: "Bid Price",
        field: "bid.price",
        width: 125,
        cellStyle: () => ({
          color: Palette.Bid,
        }),
        type: "numericColumn",
        valueFormatter: priceFormatter,
      },
      {
        headerName: "Ask Price",
        field: "ask.price",
        width: 125,
        cellStyle: () => ({
          color: Palette.Ask,
        }),
        valueFormatter: priceFormatter,
      },
      {
        headerName: "Ask Amount",
        field: "ask.amount",
        width: 145,
        valueFormatter: (params) => amountFormatter({ value: Math.abs(params.value) }),
        cellRenderer: askAmountRenderer,
      },
    ],
    []
  )

  const getRowId = useCallback(({ data }: any) => `${data.id}`, [])

  return (
    <Container className="ag-theme-quartz-dark">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={throttledOrders}
        getRowId={getRowId}
        suppressHorizontalScroll={true}
        gridOptions={{ localeText: { noRowsToShow: "Loading..." } }}
      ></AgGridReact>
    </Container>
  )
}

export default Book
