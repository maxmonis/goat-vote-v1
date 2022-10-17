import {useState} from "react"
import {Link} from "react-router-dom"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Slide from "@mui/material/Slide"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import useScrollTrigger from "@mui/material/useScrollTrigger"

import UserMenu from "./UserMenu"
import {NavBarProps, HideOnScrollProps} from "../interfaces"
import {pages} from "../constants"

const HideOnScroll = ({children, window}: HideOnScrollProps) => {
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

const NavBar = ({dark, toggleDark}: NavBarProps) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              component={Link}
              sx={{
                mr: 3,
                textDecoration: "none",
                display: {
                  xs: "none",
                  md: "flex",
                },
              }}
              to="/"
              variant="h3"
            >
              🐐
            </Typography>
            <Box
              flexGrow={1}
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(e) => setAnchorElNav(e.currentTarget)}
                color="default"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: {
                    xs: "block",
                    md: "none",
                  },
                }}
              >
                {pages.map(({name, route}) => (
                  <MenuItem
                    component={Link}
                    key={route}
                    onClick={handleCloseNavMenu}
                    to={route}
                  >
                    <Typography textAlign="center">{name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box
              flexGrow={1}
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },
              }}
            >
              <Typography
                component={Link}
                sx={{
                  textDecoration: "none",
                }}
                to="/"
                variant="h2"
              >
                🐐
              </Typography>
            </Box>
            <Box
              flexGrow={1}
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
              }}
            >
              {pages.map(({name, route}) => (
                <Button
                  component={Link}
                  key={route}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "text.primary",
                    display: "block",
                  }}
                  to={route}
                >
                  {name}
                </Button>
              ))}
            </Box>
            <UserMenu dark={dark} toggleDark={toggleDark} />
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  )

  function handleCloseNavMenu() {
    setAnchorElNav(null)
  }
}

export default NavBar
