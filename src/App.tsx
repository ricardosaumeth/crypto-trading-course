import { useEffect } from "react"
import { Provider, useDispatch } from "react-redux"
import getStore, { type AppDispatch } from "@modules/redux/store"
import { bootstrapApp } from "@modules/app/slice"

const store = getStore()

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(bootstrapApp())
  }, [])

  return <h1>hello..</h1>
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
