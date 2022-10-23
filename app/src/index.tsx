import {createRoot} from "react-dom/client"
import {Provider} from "react-redux"

import "./localization/i18n"
import {store} from "./app/store"
import * as serviceWorker from "./serviceWorker"
import App from "./App"

const container = document.getElementById("root")
const root = createRoot(container as HTMLElement)

root.render(
  <Provider {...{store}}>
    <App />
  </Provider>
)

serviceWorker.unregister()
