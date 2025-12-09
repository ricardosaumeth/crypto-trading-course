import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const bootstrapApp = createAsyncThunk("app/bootstrap", async (_, {}) => {
  return true
})

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
