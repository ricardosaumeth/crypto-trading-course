import { useEffect } from "react"
import { Provider, useDispatch } from "react-redux"
import getStore, { type AppDispatch } from "@modules/redux/store"
import { bootstrapApp } from "@modules/app/slice"
import {
  BookPanel,
  CandlesPanel,
  Container,
  Content,
  DepthPanel,
  Footer,
  Header,
  MarketPanel,
  TickersPanel,
  TradesPanel,
} from "./App.styled"

const store = getStore()

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(bootstrapApp())
  }, [])

  return (
    <Container>
      <Content>
        <Header>Crypto App</Header>
        <TickersPanel>tickers</TickersPanel>
        <MarketPanel>market</MarketPanel>
        <TradesPanel>trades</TradesPanel>
        <CandlesPanel>candles</CandlesPanel>
        <BookPanel>book</BookPanel>
        <DepthPanel>depth</DepthPanel>
        <Footer>
          <span>Latency</span>
          <span>Diagnostic</span>
        </Footer>
      </Content>
    </Container>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
