import { range } from "lodash"
import { createSelector } from "@reduxjs/toolkit"
import { type RootState } from "@modules/redux/store"
import { type Ticker } from "@modules/tickers/types/Ticker"
import { getCurrencyPairs } from "@modules/refence-data/selectors"
import { getSelectedCurrencyPair } from "@modules/selection/selector"
import { candlesSelector } from "@modules/candles/selector"
import { getValueAt } from "@core/utils"
import { getLookupKey } from "@modules/candles/utils"
import { DEFAULT_TIMEFRAME } from "@modules/app/slice"

const tickerSelector = (state: RootState) => state.ticker

export const getTicker = createSelector(
  tickerSelector,
  (ticker) => (symbol: string) => ticker[symbol]
)

export const getTickers = createSelector(
  getCurrencyPairs,
  tickerSelector,
  (currencyPairs, ticker) =>
    currencyPairs
      .map((currencyPair) => ({
        ...ticker[currencyPair],
        currencyPair,
      }))
      .filter(
        (item): item is Ticker & { currencyPair: string } =>
          item.lastPrice !== undefined &&
          item.dailyChange !== undefined &&
          item.dailyChangeRelative !== undefined
      )
)

export const getVisibleCurrencyPairTickers = createSelector(
  getCurrencyPairs,
  getSelectedCurrencyPair,
  (allCurrencyPairs, selectedCurrencyPair) => {
    let currencyPairs: string[] = []

    const selectedCurrencyPairIndex = allCurrencyPairs.indexOf(selectedCurrencyPair || "")

    // Pick a few currency pairs on each side of the selected one
    if (selectedCurrencyPairIndex >= 0) {
      currencyPairs = range(selectedCurrencyPairIndex - 2, selectedCurrencyPairIndex + 3)
        .map((index) => getValueAt(allCurrencyPairs)(index))
        .filter((pair): pair is string => pair !== undefined)
    }

    // example: If selectedCurrencyPairIndex = 5, then:
    // range(5 - 2, 5 + 3) = range(3, 8)
    // [3, 4, 5, 6, 7]

    return {
      currencyPairs,
      selectedCurrencyPairIndex,
    }
  }
)

export const getTickersWithPrices = createSelector(
  getTickers,
  candlesSelector,
  (tickers, candles) => {
    return tickers.map((ticker) => ({
      ...ticker,
      prices: (candles[getLookupKey(ticker.currencyPair, DEFAULT_TIMEFRAME)] || []).map(
        (candle) => candle.close
      ),
    }))
  }
)
