import type { Candle } from "../types/Candle"
import { Container } from "./CandlesChart.styled"

export interface Props {
  candles: Candle[]
  currencyPair: string
  isStale: boolean
}

const CandlesChart = ({ candles, currencyPair, isStale }: Props) => {
  console.log("data", candles)
  return <Container className="candles-chart">From Candles</Container>
}

export default CandlesChart
