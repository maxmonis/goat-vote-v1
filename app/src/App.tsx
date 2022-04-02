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

import Footer from './components/Footer'
import NavBar from './components/NavBar'
import LocalStorageService from './services/LocalStorageService'
import NewListApp from './features/create/NewListApp'
import Home from './pages/Home'

const App = () => {
  const localDark = new LocalStorageService('prefers-dark')
  const localPrefersDark = localDark.get()
  const browserPrefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [dark, setDark] = useState(
    typeof localPrefersDark === 'boolean'
      ? localPrefersDark
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
    localDark.set(dark)
    //eslint-disable-next-line
  }, [dark])
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Box>
          <NavBar dark={dark} toggleDark={toggleDark} />
          <Container
            maxWidth='xl'
            sx={{
              mx: 'auto',
              minHeight: '90vh',
              width: '100%',
            }}>
            <Routes>
              <Route path='/:sport' element={<NewListApp />} />
              <Route path='/' element={<Home />} />
            </Routes>
          </Container>
        </Box>
        <Footer />
      </ThemeProvider>
    </Router>
  )
}

export default App
