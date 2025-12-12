import { configureStore } from "@reduxjs/toolkit"
import { appBootstrapSlice } from "@modules/app/slice"
import { WsConnectionProxy } from "@core/transport/WsConnectionProxy"
import { Connection } from "@core/transport/Connection"
import { changeConnectionStatus, subscriptionsSlice } from "@core/transport/slice"
import { ConnectionStatus } from "@core/transport/types/ConnectionStatus"
import { refDataSlice } from "@modules/refence-data/slice"
import { selectionSlice } from "@modules/selection/slice"
import { createWsMiddleware } from "@core/transport/wsMiddleware"

const connectionProxy = new WsConnectionProxy(
  import.meta.env["VITE_BITFINEX_WS_URL"] || "wss://api-pub.bitfinex.com/ws/2"
)

const connection = new Connection(connectionProxy)

let storeInstance: ReturnType<typeof createStore> | null = null

function createStore() {
  const store = configureStore({
    reducer: {
      app: appBootstrapSlice.reducer,
      subscriptions: subscriptionsSlice.reducer,
      refData: refDataSlice.reducer,
      selection: selectionSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { connection },
        },
      }).concat(createWsMiddleware(connection)),
  })

  connection.onConnect(() => {
    store.dispatch(changeConnectionStatus(ConnectionStatus.Connected))
    console.log("Connected")
  })

  connection.onClose(() => {
    store.dispatch(changeConnectionStatus(ConnectionStatus.Disconnected))
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
