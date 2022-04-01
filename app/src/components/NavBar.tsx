import { useState, MouseEvent, ReactElement } from 'react'
import { Link } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Slide from '@mui/material/Slide'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import useScrollTrigger from '@mui/material/useScrollTrigger'

import UserMenu from './UserMenu'

const pages = [
  { name: 'Baseball', route: '/baseball' },
  { name: 'Basketball', route: '/basketball' },
  { name: 'Football', route: '/football' },
]

interface NavBarProps {
  dark: boolean
  toggleDark: Function
}

interface HideProps {
  window?: () => Window
  children: ReactElement
}

const HideOnScroll = ({ children, window }: HideProps) => {
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  })
  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  )
}

const NavBar = ({ dark, toggleDark }: NavBarProps) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
    <HideOnScroll {...this}>
      <AppBar position='sticky'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Typography
              variant='h3'
              component={Link}
              to='/'
              sx={{
                mr: 3,
                textDecoration: 'none',
                display: { xs: 'none', md: 'flex' },
              }}>
              🐐
            </Typography>
            <Box
              flexGrow={1}
              sx={{
                display: { xs: 'flex', md: 'none' },
              }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'>
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}>
                {pages.map(({ name, route }) => (
                  <MenuItem
                    component={Link}
                    to={route}
                    key={route}
                    onClick={handleCloseNavMenu}>
                    <Typography textAlign='center'>{name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box
              flexGrow={1}
              sx={{
                display: { xs: 'flex', md: 'none' },
              }}>
              <Typography
                variant='h2'
                component={Link}
                to='/'
                sx={{
                  textDecoration: 'none',
                }}>
                🐐
              </Typography>
            </Box>
            <Box
              flexGrow={1}
              sx={{
                display: { xs: 'none', md: 'flex' },
              }}>
              {pages.map(({ name, route }) => (
                <Button
                  component={Link}
                  to={route}
                  key={route}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                  }}>
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
}

export default NavBar
