import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Connection } from "@core/transport/Connection"

export const bootstrapApp = createAsyncThunk(
  "app/bootstrap",
  async (_, { _dispatch, _getState, extra }) => {
    const { connection } = extra as { connection: Connection }
    connection.connect()
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
