import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Connection } from "@core/transport/Connection"
import { ConnectionStatus } from "@core/transport/types/ConnectionStatus"
import type { RootState } from "@modules/redux/store"

const CHECK_CONNECTION_TIMEOUT_IN_MS = 100

const waitForConnection = (getState: () => RootState): Promise<void> => {
  return new Promise((resolve) => {
    const checkConnection = () => {
      if (getState().subscriptions.wsConnectionStatus === ConnectionStatus.Connected) {
        resolve()
      } else {
        setTimeout(checkConnection, CHECK_CONNECTION_TIMEOUT_IN_MS)
      }
    }
    checkConnection()
  })
}

export const bootstrapApp = createAsyncThunk(
  "app/bootstrap",
  async (_, { _dispatch, getState, extra }) => {
    const { connection } = extra as { connection: Connection }
    connection.connect()
    await waitForConnection(getState as () => RootState)
    // fetch our currrencies
    return true
  }
)

export const appBootstrapSlice = createSlice({
  name: "app/bootstrap",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(bootstrapApp.fulfilled, (_state, _action) => {
      console.log(`Bootstrap App successfully`)
    })
  },
})

export const {} = appBootstrapSlice.actions
export default appBootstrapSlice.reducer
