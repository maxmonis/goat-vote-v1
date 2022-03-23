import { useState, MouseEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Slide from '@mui/material/Slide'
import Switch from '@mui/material/Switch'
import UserMenu from './UserMenu'
import useScrollTrigger from '@mui/material/useScrollTrigger'

interface HeaderProps {
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

const Header = ({ dark, toggleDark }: HeaderProps) => {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpenSettingsMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseSettingsMenu = () => {
    setAnchorEl(null)
  }

  return (
    <HideOnScroll {...this}>
      <AppBar position='sticky'>
        <Container maxWidth='lg'>
          <Toolbar
            sx={{
              mx: 'auto',
              px: 4,
              width: '100%',
            }}>
            <Container sx={{ display: { xs: 'none', sm: 'flex' }, gap: 10 }}>
              <Typography variant='h4'>Goat Vote</Typography>
              <Container sx={{ display: { sm: 'none' } }}>
                <IconButton onClick={handleOpenSettingsMenu}>
                  <MenuIcon />
                </IconButton>
                <Menu
                  sx={{ display: { sm: 'none' } }}
                  id='menu-appbar'
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseSettingsMenu}>
                  <Container>
                    <Tooltip
                      title={t('Toggle dark') as string}
                      placement='right-end'>
                      <Typography variant='h5'>
                        🌞
                        <Switch checked={dark} onChange={() => toggleDark()} />
                        🌛
                      </Typography>
                    </Tooltip>
                  </Container>
                </Menu>
              </Container>
              <Tooltip title={t('Toggle dark') as string} placement='bottom'>
                <Typography variant='h5'>
                  🌞
                  <Switch checked={dark} onChange={() => toggleDark()} />
                  🌛
                </Typography>
              </Tooltip>
            </Container>
            <Container sx={{ display: { sm: 'none' } }}>
              <IconButton onClick={handleOpenSettingsMenu}>
                <MenuIcon />
              </IconButton>
              <Menu
                sx={{ display: { sm: 'none' } }}
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseSettingsMenu}>
                <Container>
                  <Tooltip
                    title={t('Toggle dark') as string}
                    placement='right-end'>
                    <Typography variant='h5'>
                      🌞
                      <Switch checked={dark} onChange={() => toggleDark()} />
                      🌛
                    </Typography>
                  </Tooltip>
                </Container>
              </Menu>
            </Container>
            <UserMenu />
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  )
}

export default Header
