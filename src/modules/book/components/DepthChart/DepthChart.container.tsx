import { getDepth } from "@modules/book/selectors"
import type { RootState } from "@modules/redux/store"
import { getSelectedCurrencyPair } from "@modules/selection/selector"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import DepthChart from "./DepthChart"

const DepthContainer = () => {
  const selectedCurrencyPair = useSelector(getSelectedCurrencyPair)

  const emptyDepth = useMemo(() => ({ bids: [], asks: [] }), [])

  const depth = useSelector((state: RootState) =>
    selectedCurrencyPair ? getDepth(state, selectedCurrencyPair) : emptyDepth
  )

  return <DepthChart depth={depth} />
}

export default DepthContainer
