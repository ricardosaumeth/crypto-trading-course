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
import CandlesChart from "@modules/candles/components"
import Trades from "@modules/trades/components"
import DepthChart from "@modules/book/components/DepthChart"
import Book from "@modules/book/components/Book"
import Market from "@modules/tickers/components/Market"
import Tickers from "@modules/tickers/components/Tickers"

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
        <TickersPanel>
          <Tickers />
        </TickersPanel>
        <MarketPanel>
          <Market />
        </MarketPanel>
        <TradesPanel>
          <Trades />
        </TradesPanel>
        <CandlesPanel>
          <CandlesChart />
        </CandlesPanel>
        <BookPanel>
          <Book />
        </BookPanel>
        <DepthPanel>
          <DepthChart />
        </DepthPanel>
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
