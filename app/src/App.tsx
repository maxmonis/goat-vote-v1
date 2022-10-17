import {useState, useEffect} from "react"
import {Route, BrowserRouter as Router, Routes} from "react-router-dom"

import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import CssBaseline from "@mui/material/CssBaseline"
import useMediaQuery from "@mui/material/useMediaQuery"

import Footer from "./components/Footer"
import Home from "./pages/Home"
import LocalStorageService from "./services/LocalStorageService"
import NavBar from "./components/NavBar"
import NewListApp from "./features/create/NewListApp"

const App = () => {
  const localDark = new LocalStorageService("prefers-dark")
  const localPrefersDark = localDark.get<boolean>()
  const browserPrefersDark = useMediaQuery("(prefers-color-scheme: dark)")
  const [dark, setDark] = useState(
    typeof localPrefersDark === "boolean"
      ? localPrefersDark
      : browserPrefersDark
  )

  const theme = responsiveFontSizes(
    createTheme({
      palette: {
        mode: dark ? "dark" : "light",
      },
      spacing: (factor = 1) => `${0.25 * factor}rem`,
    })
  )

  useEffect(() => {
    localDark.set(dark)
    // eslint-disable-next-line
  }, [dark])

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Box>
          <NavBar dark={dark} toggleDark={() => setDark(!dark)} />
          <Container
            maxWidth="xl"
            sx={{
              minHeight: "90vh",
              mx: "auto",
              width: "100%",
            }}
          >
            <Routes>
              <Route path="/:sport" element={<NewListApp />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Container>
        </Box>
        <Footer />
      </ThemeProvider>
    </Router>
  )
}

export default App
