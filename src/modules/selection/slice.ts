import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface CurrencyPairState {
  currencyPair: string
}

const initialState: CurrencyPairState = {
  currencyPair: "",
}

export const selectCurrencyPair = createAsyncThunk(
  "selection/selectCurrencyPair",
  async ({ currencyPair }: { currencyPair: string }, { dispatch }) => {
    dispatch(selectionSlice.actions.setCurrencyPair({ currencyPair }))
    // We will trigger additional dispatches
    return currencyPair
  }
)

export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    setCurrencyPair: (state, action: PayloadAction<{ currencyPair: string }>) => {
      const { currencyPair } = action.payload
      state.currencyPair = currencyPair
    },
  },
})

export default selectionSlice.reducer
