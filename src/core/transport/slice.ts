import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ConnectionStatus } from "./types/ConnectionStatus"

export interface SubscriptionState {
  wsConnectionStatus: ConnectionStatus
}

const initialState: SubscriptionState = {
  wsConnectionStatus: ConnectionStatus.Disconnected,
}

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    changeConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.wsConnectionStatus = action.payload
    },
  },
})

export const { changeConnectionStatus } = subscriptionsSlice.actions
export default subscriptionsSlice.reducer
