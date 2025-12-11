import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ConnectionStatus } from "./types/ConnectionStatus"
import { Channel, type ChannelTypes } from "./types/Channels"
import { SubscriptionActionType, type SubscriptionActionTypes } from "./types/ActionTypes"
import type { Connection } from "./Connection"
import type { SubscribeMsg } from "./types/SubscribeMsg"

export interface SubscriptionState {
  wsConnectionStatus: ConnectionStatus
}

const initialState: SubscriptionState = {
  wsConnectionStatus: ConnectionStatus.Disconnected,
}

interface SubscribePayload {
  symbol: string
  timeframe?: string
  prec?: string
}

const createSubscribeThunk = (channel: ChannelTypes, actionType: SubscriptionActionTypes) =>
  createAsyncThunk(actionType, async ({ symbol, timeframe, prec }: SubscribePayload, { extra }) => {
    const { connection } = extra as { connection: Connection }
    const msg: SubscribeMsg = {
      event: "subscribe",
      channel,
    }

    switch (channel) {
      case Channel.TICKER:
        msg.symbol = `t${symbol}`
        break
      case Channel.CANDLES:
        msg.key = `trade:${timeframe}:t${symbol}`
        break
      default:
        console.warn("Unhandled channel:", channel)
    }

    connection.send(msg)
    return msg
  })

export const tickerSubscribeToSymbol = createSubscribeThunk(
  Channel.TICKER,
  SubscriptionActionType.SUBSCRIBE_TO_TICKER
)

export const candlesSubscribeToSymbol = createSubscribeThunk(
  Channel.CANDLES,
  SubscriptionActionType.SUBSCRIBE_TO_CANDLES
)

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    changeConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.wsConnectionStatus = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tickerSubscribeToSymbol.fulfilled, (_state, action) => {
        console.log(`Subscribed to ticker ${JSON.stringify(action.payload)}`)
      })
      .addCase(candlesSubscribeToSymbol.fulfilled, (_state, action) => {
        console.log(`Subscribed to candle ${JSON.stringify(action.payload)}`)
      })
  },
})

export const { changeConnectionStatus } = subscriptionsSlice.actions
export default subscriptionsSlice.reducer
