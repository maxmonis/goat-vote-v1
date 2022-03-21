import { useState, useEffect } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'

import Counter from './features/counter/Counter'
import Footer from './components/Footer'
import Header from './components/Header'
import LocalStorageService from './services/localStorageService'
import NewListApp from './features/create/NewListApp'

const App = () => {
  const localStorageService = new LocalStorageService()
  const localStorageDarkSetting = localStorageService.get('prefers-dark')
  const browserPrefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [dark, setDark] = useState(
    typeof localStorageDarkSetting === 'boolean'
      ? localStorageDarkSetting
      : Boolean(browserPrefersDark)
  )
  const toggleDark = () => setDark(!dark)
  let theme = createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
    },
    spacing: (factor = 1) => `${0.25 * factor}rem`,
  })
  theme = responsiveFontSizes(theme)
  useEffect(() => {
    localStorageService.set('prefers-dark', Boolean(dark))
    //eslint-disable-next-line
  }, [dark])
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Box>
          <Header dark={dark} toggleDark={toggleDark} />
          <Container
            maxWidth='lg'
            sx={{
              mx: 'auto',
              minHeight: '90vh',
              width: '100%',
            }}>
            <Routes>
              <Route path='/counter' element={<Counter />} />
              <Route path='/new-list' element={<NewListApp />} />
              <Route path='/' element={<NewListApp />} />
            </Routes>
          </Container>
        </Box>
        <Footer />
      </ThemeProvider>
    </Router>
  )
}

export default App
