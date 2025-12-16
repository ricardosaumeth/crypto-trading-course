import { useSelector } from "react-redux"
import CandlesChart from "./CandlesChart"
import { getSelectedCurrencyPair } from "@modules/selection/selector"
import { DEFAULT_TIMEFRAME } from "@modules/app/slice"
import type { RootState } from "@modules/redux/store"
import { useMemo } from "react"
import { getCandles } from "../selector"
import type { Candle } from "../types/Candle"

const CandlesChartContainer = () => {
  const selectedCurrencyPair = useSelector(getSelectedCurrencyPair)

  const emptyCandles: Candle[] = []
  const selectCandles = useMemo(
    () => (state: RootState) =>
      selectedCurrencyPair
        ? (getCandles(state)(selectedCurrencyPair, DEFAULT_TIMEFRAME) ?? emptyCandles)
        : emptyCandles,
    [selectedCurrencyPair]
  )
  const candles = useSelector(selectCandles)

  return <CandlesChart candles={candles} currencyPair={selectedCurrencyPair} isStale={false} />
}

export default CandlesChartContainer
