import type { Middleware } from "@reduxjs/toolkit"
import { Connection } from "./Connection"
import { handleSubscriptionAck } from "./handlers"

export const createWsMiddleware = (connection: Connection): Middleware => {
  return (store) => {
    connection.onReceive((data) => {
      const parsedData = JSON.parse(data)

      if (parsedData.event === "subscribed") {
        handleSubscriptionAck(parsedData, store)
        return
      }

      if (Array.isArray(parsedData)) {
        const [channelId] = parsedData
        const subscriptions = store.getState().subscriptions
        const subscription = store.getState().subscriptions[channelId]
        console.log(subscriptions)
        console.log("/***********************/")
        console.log(subscription)
      }
    })

    return (next) => (action) => next(action)
  }
}
