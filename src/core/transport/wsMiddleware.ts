import type { Middleware } from "@reduxjs/toolkit"
import { Connection } from "./Connection"

export const createWsMiddleware = (connection: Connection): Middleware => {
  return (store) => {
    connection.onReceive((data) => {
      const parsedData = JSON.parse(data)
      console.log(data)
    })

    return (next) => (action) => next(action)
  }
}
