import {render} from "@testing-library/react"
import {Provider} from "react-redux"
import {store} from "./app/store"
import App from "./App"

test("renders hero header", () => {
  const {getByText} = render(
    <Provider {...{store}}>
      <App />
    </Provider>
  )

  getByText(/Who's the GOAT?/)
})
