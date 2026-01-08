import { useState, useEffect } from "react"
import { performanceTracker } from "@services/performanceTracker"
import { Channel } from "../transport/types/Channels"

const ConnectionHealth = {
  GOOD: "good",
  WARNING: "warning",
  POOR: "poor",
} as const

type ConnectionHealthTypes = (typeof ConnectionHealth)[keyof typeof ConnectionHealth]

interface DataLatencies {
  trades: number
  tickers: number
  orderBook: number
  candles: number
}

interface PerformanceMetrics {
  fps: number
  memory: number
  dataLatencies: DataLatencies
  connectionHealth: ConnectionHealthTypes
}

export const usePerformanceMonitor = (): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    dataLatencies: {
      trades: 0,
      tickers: 0,
      orderBook: 0,
      candles: 0,
    },
    connectionHealth: ConnectionHealth.GOOD,
  })

  useEffect(() => {
    performanceTracker.subscribe(Channel.TRADES, (latency) => {
      setMetrics((prev) => {
        const newMetrics = {
          ...prev,
          dataLatencies: { ...prev.dataLatencies, trades: latency },
        }
        return { ...newMetrics, connectionHealth: calculateConnectionHealth(newMetrics) }
      })
    })

    performanceTracker.subscribe(Channel.TICKER, (latency) => {
      setMetrics((prev) => {
        const newMetrics = {
          ...prev,
          dataLatencies: { ...prev.dataLatencies, tickers: latency },
        }
        return { ...newMetrics, connectionHealth: calculateConnectionHealth(newMetrics) }
      })
    })

    performanceTracker.subscribe(Channel.BOOK, (latency) => {
      setMetrics((prev) => {
        const newMetrics = {
          ...prev,
          dataLatencies: { ...prev.dataLatencies, orderBook: latency },
        }
        return { ...newMetrics, connectionHealth: calculateConnectionHealth(newMetrics) }
      })
    })

    performanceTracker.subscribe(Channel.CANDLES, (latency) => {
      setMetrics((prev) => {
        const newMetrics = {
          ...prev,
          dataLatencies: { ...prev.dataLatencies, candles: latency },
        }
        return { ...newMetrics, connectionHealth: calculateConnectionHealth(newMetrics) }
      })
    })

    // FPS monitoring
    let frameCount = 0
    let lastTime = performance.now()

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        const currentFPS = frameCount // Capture value before reset

        setMetrics((prev) => {
          const newMetrics = { ...prev, fps: currentFPS }
          return { ...newMetrics, connectionHealth: calculateConnectionHealth(newMetrics) }
        })
        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(measureFPS)
    }

    // Memory monitoring
    const measureMemory = () => {
      if ("memory" in performance && performance.memory) {
        const memoryInfo = performance.memory as any
        const used = memoryInfo.usedJSHeapSize / 1024 / 1024
        setMetrics((prev) => {
          const newMetrics = { ...prev, memory: used }
          return { ...newMetrics, connectionHealth: calculateConnectionHealth(newMetrics) }
        })
      }
    }

    const calculateConnectionHealth = (metrics: PerformanceMetrics): ConnectionHealthTypes => {
      const avgLatency =
        Object.values(metrics.dataLatencies).reduce((sum, latency) => sum + latency, 0) / 4

      if (avgLatency > 10 || metrics.fps < 2 || metrics.memory > 500) {
        return ConnectionHealth.POOR
      }

      if (avgLatency > 5 || metrics.fps < 10 || metrics.memory > 200) {
        return ConnectionHealth.WARNING
      }

      return ConnectionHealth.GOOD
    }

    measureFPS()
    const memoryInterval = setInterval(measureMemory, 5000)

    return () => {
      clearInterval(memoryInterval)
      performanceTracker.unsubscribe(Channel.TRADES)
      performanceTracker.unsubscribe(Channel.TICKER)
      performanceTracker.unsubscribe(Channel.BOOK)
      performanceTracker.unsubscribe(Channel.CANDLES)
    }
  }, [])

  return metrics
}
