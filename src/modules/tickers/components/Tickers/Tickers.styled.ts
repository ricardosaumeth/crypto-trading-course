import styled from "styled-components"
import { range } from "lodash"
import { Container as TickerContainer } from "../Ticker/Ticker.styled"

export type ScrollDirection = "left" | "right"

export const Container = styled.div<{
  $itemCount: number
}>`
  display: grid;
  grid-template-columns: ${({ $itemCount }) => `repeat(${$itemCount}, minmax(240px, 1fr))`};
  width: 100%;
`
// - Creates animations on the fly (one animation per item).
// - Applies the correct animation to each ticker item.
// - Makes items slide in from the left or right.
// - Makes items in the middle look bigger and items on the edges look smaller.
export const TickerWrapper = styled.div<{
  $index: number
  $itemCount: number
  $direction: ScrollDirection
}>`
  ${({ $itemCount }) => {
    const animations = range(0, $itemCount).map((index) => {
      const indexThreshold = Math.floor($itemCount / 2)
      const val =
        index <= indexThreshold ? index : indexThreshold - Math.abs(indexThreshold - index)
      const scaleFactor = 1 - (indexThreshold - val) / 10
      // Items near the middle should be bigger.
      // Items near the edges should be smaller.
      // index: 0 → small
      // index: 1 → medium
      // index: 2 → big (center)
      // index: 3 → medium
      // index: 4 → small

      return `
            @keyframes slide-in-${index} {
                100% { transform: scale(${scaleFactor}, ${scaleFactor}) translateX(0%);; }
            }
            `
    })
    // Combine all the animations into one big string so styled-components
    // can inject them into the CSS.
    return animations.reduce((acc, a) => (acc += a), "")
  }}

  ${TickerContainer} {
    animation: ${({ $index }) => `slide-in-${$index} 0.5s forwards;`};
    transform: ${({ $direction }) => `translateX(${$direction === "left" ? 100 : -100}%);`};
  }
`
