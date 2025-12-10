import { configureStore } from "@reduxjs/toolkit"
import { appBootstrapSlice } from "@modules/app/slice"
import { WsConnectionProxy } from "@core/transport/WsConnectionProxy"
import { Connection } from "@core/transport/Connection"

const connectionProxy = new WsConnectionProxy(
  import.meta.env["VITE_BITFINEX_WS_URL"] || "wss://api-pub.bitfinex.com/ws/2"
)

const connection = new Connection(connectionProxy)

let storeInstance: ReturnType<typeof createStore> | null = null

function createStore() {
  const store = configureStore({
    reducer: {
      app: appBootstrapSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { connection },
        },
      }),
  })

  connection.onConnect(() => {
    console.log("Connected")
  })

  connection.onClose(() => {
    console.log("Disconnected - will auto-reconnect")
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
