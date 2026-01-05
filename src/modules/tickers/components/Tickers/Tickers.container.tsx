import { useSelector } from "react-redux"
import { getVisibleCurrencyPairTickers } from "@modules/tickers/selectors"
import Tickers from "./Tickers"

const TickersContainer = () => {
  const { currencyPairs, selectedCurrencyPairIndex } = useSelector(getVisibleCurrencyPairTickers)

  return (
    <Tickers currencyPairs={currencyPairs} selectedCurrencyPairIndex={selectedCurrencyPairIndex} />
  )
}

export default TickersContainer
