import { StrictMode } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import App from './App'
import { store } from './app/store'
import * as serviceWorker from './serviceWorker'

import './localization/i18n'
import './index.scss'

render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
