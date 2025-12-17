import { useSelector } from "react-redux"
import { getTradesForSelectedPair } from "../selector"
import Trades from "./Trades"

const TradesContainer = () => {
  const trades = useSelector(getTradesForSelectedPair)

  return <Trades trades={trades} />
}

export default TradesContainer
