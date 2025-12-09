import { configureStore } from "@reduxjs/toolkit"
import { appBootstrapSlice } from "@modules/app/slice"

let storeInstance: ReturnType<typeof createStore> | null = null

function createStore() {
  const store = configureStore({
    reducer: {
      app: appBootstrapSlice.reducer,
    },
  })

  return store
}

export const getStore = () => {
  if (!storeInstance) {
    storeInstance = createStore()
  }
  return storeInstance
}

export default getStore

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>
export type AppDispatch = ReturnType<typeof createStore>["dispatch"]
