import { useMemo } from "react"
import { useSelector } from "react-redux"
import { getBook } from "@modules/book/selectors"
import { type RootState } from "@modules/redux/store"
import { getSelectedCurrencyPair } from "@modules/selection/selector"
import Book from "./Book"

const BookContainer = () => {
  const selectedCurrencyPair = useSelector(getSelectedCurrencyPair)
  const emptyOrders = useMemo(() => [], [])

  const orders = useSelector((state: RootState) =>
    selectedCurrencyPair ? getBook(state, selectedCurrencyPair) : emptyOrders
  )

  return <Book orders={orders} />
}

export default BookContainer
