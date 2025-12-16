import { useEffect, useState } from "react"
import type { Candle } from "../types/Candle"
import { Container } from "./CandlesChart.styled"
import Highcharts from "highcharts/highstock"
import HighchartsReact from "highcharts-react-official"
import Palette from "@theme/style"
import { formatCurrencyPair } from "@modules/refence-data/utils"
import "@theme/Highchart"

export interface Props {
  candles: Candle[]
  currencyPair: string
  isStale: boolean
}

const CandlesChart = ({ candles, currencyPair, isStale }: Props) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    time: {
      useUTC: false,
    },
    yAxis: [
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "OHLC",
        },
        height: "70%",
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Volume",
        },
        top: "75%",
        height: "25%",
        offset: 0,
        lineWidth: 2,
      },
    ],
    series: [
      {
        type: "candlestick",
        data: [],
      },
      {
        type: "column",
        name: "Volume",
        data: [],
        yAxis: 1,
      },
    ],
  } as Highcharts.Options)

  useEffect(() => {
    if (candles && candles.length > 0) {
      const ohlc = candles.map(({ timestamp, open, high, low, close }) => [
        timestamp,
        open,
        high,
        low,
        close,
      ])

      const volumes = candles
        .map(({ timestamp, volume }) => [timestamp, volume])
        .sort((a, b) => a[0]! - b[0]!)

      setChartOptions({
        series: [
          {
            type: "candlestick",
            name: formatCurrencyPair(currencyPair),
            data: ohlc,
          },
          {
            type: "column",
            data: volumes,
          },
        ],
        plotOptions: {
          candlestick: {
            color: Palette.Ask,
            upColor: Palette.Bid,
          },
          column: {
            color: Palette.SteelBlue,
            borderRadius: 0,
            borderWidth: 0,
          },
        },
      })
    }
  }, [candles, currencyPair])

  return (
    <Container className="candles-chart">
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        constructorType={"stockChart"}
      />
    </Container>
  )
}

export default CandlesChart
