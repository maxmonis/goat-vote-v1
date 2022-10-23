import {useState} from "react"
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

import Footer from "./features/footer/Footer"
import Home from "./pages/Home"
import LocalStorage from "./utils/LocalStorage"
import NavBar from "./features/header/NavBar"
import NewListApp from "./features/rankings/NewListApp"

const darkStorage = new LocalStorage("prefers-dark")

const App = () => {
  const localPrefersDark = darkStorage.get<boolean>()
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

  const toggleDark = () => {
    darkStorage.set(!dark)
    setDark(!dark)
  }

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Box>
          <NavBar {...{dark, toggleDark}} />
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
