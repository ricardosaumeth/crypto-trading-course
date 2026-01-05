import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { type AppDispatch } from "@modules/redux/store"
import { getTicker } from "@modules/tickers/selectors"
import { selectCurrencyPair } from "@modules/selection/slice"
import { getSelectedCurrencyPair } from "@modules/selection/selector"
import Ticker from "./Ticker"

export interface ContainerProps {
  currencyPair: string
}

const TickerContainer = ({ currencyPair }: ContainerProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const ticker = useSelector(getTicker)(currencyPair)
  const { lastPrice, dailyChange, dailyChangeRelative } = ticker || {}

  const selectedCurrencyPair = useSelector(getSelectedCurrencyPair)

  return (
    <Ticker
      currencyPair={currencyPair}
      lastPrice={lastPrice!}
      dailyChange={dailyChange!}
      dailyChangeRelative={dailyChangeRelative!}
      onClick={() => dispatch(selectCurrencyPair({ currencyPair }))}
      isActive={selectedCurrencyPair === currencyPair}
    />
  )
}

export default TickerContainer
