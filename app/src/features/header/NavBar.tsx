import {useEffect, useState} from "react"
import {Link} from "react-router-dom"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"

import {pages} from "../../shared/constants"
import HideOnScroll from "../../components/HideOnScroll"
import NavBarMenu from "./NavBarMenu"
import UserMenu from "./UserMenu"
import useViewport from "../../hooks/useViewport"

type NavBarProps = {
  dark: boolean
  toggleDark: () => void
}

const NavBar = ({dark, toggleDark}: NavBarProps) => {
  const width = useViewport()
  const isMobile = width < 500

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const onClose = () => setAnchorEl(null)

  useEffect(onClose, [isMobile])

  const homeLink = (
    <Typography
      component={Link}
      sx={{
        fontSize: 36,
        px: 3,
        textDecoration: "none",
      }}
      to="/"
    >
      🐐
    </Typography>
  )

  const mobileContent = (
    <>
      <Box flexGrow={1}>
        <IconButton
          color="default"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        <NavBarMenu horizontal="left" {...{anchorEl, onClose}}>
          {pages.map(({name, route}) => (
            <MenuItem component={Link} key={route} onClick={onClose} to={route}>
              <Typography textAlign="center">{name}</Typography>
            </MenuItem>
          ))}
        </NavBarMenu>
      </Box>
      <Box flexGrow={1}>{homeLink}</Box>
    </>
  )

  const desktopContent = (
    <>
      {homeLink}
      <Box display="flex" flexGrow={1}>
        {pages.map(({name, route}) => (
          <Button
            component={Link}
            key={route}
            onClick={onClose}
            sx={{
              color: "text.primary",
              display: "block",
            }}
            to={route}
          >
            {name}
          </Button>
        ))}
      </Box>
    </>
  )

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "background.paper",
          pr: 2,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile ? mobileContent : desktopContent}
            <UserMenu dark={dark} toggleDark={toggleDark} />
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  )
}

export default NavBar
