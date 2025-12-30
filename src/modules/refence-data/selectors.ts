import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "@modules/redux/store"

const refDataSelector = (state: RootState) => state.refData

export const getCurrencyPairs = createSelector(refDataSelector, (refData) => refData.currencyPairs)
