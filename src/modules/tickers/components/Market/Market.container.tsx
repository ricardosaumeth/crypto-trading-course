import { useSelector } from "react-redux"
import { getTickersWithPrices } from "@modules/tickers/selectors"
import { getSelectedCurrencyPair } from "@modules/selection/selector"
import Market from "./Market"

const MarketContainer = () => {
  const tickers = useSelector(getTickersWithPrices)
  const selectedCurrencyPair = useSelector(getSelectedCurrencyPair)

  return <Market tickers={tickers} selectedCurrencyPair={selectedCurrencyPair} />
}

export default MarketContainer
