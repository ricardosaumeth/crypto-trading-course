import type { Middleware } from "@reduxjs/toolkit"
import { Connection } from "./Connection"
import { handleSubscriptionAck, handleTickerData } from "./handlers"
import { Channel } from "./types/Channels"

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
        const subscription = store.getState().subscriptions[channelId]

        if (!subscription || parsedData[1] === "hb") {
          return
        }

        switch (subscription.channel) {
          case Channel.TRADES:
            //handleTradesData(parsedData, subscription, store.dispatch)
            break

          case Channel.TICKER:
            handleTickerData(parsedData, subscription, store.dispatch)
            break

          case Channel.CANDLES:
            //handleCandlesData(parsedData, subscription, store.dispatch)
            break

          case Channel.BOOK:
            //handleBookData(parsedData, subscription, store.dispatch)
            break

          default:
            console.warn("Unhandled channel:", subscription.channel)
            break
        }
      }
    })

    return (next) => (action) => next(action)
  }
}
