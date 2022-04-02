import { useState, MouseEvent } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { useTranslation } from 'react-i18next'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/system/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'

import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectUser, setUser, resetUser } from '../features/auth/authSlice'
import { UserMenuProps } from '../interfaces'

const UserMenu = ({ dark, toggleDark }: UserMenuProps) => {
  const { profileObj } = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setUserAnchorEl(null)
  }

  const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID
  if (typeof clientId !== 'string') return null

  return profileObj ? (
    <Box>
      <Tooltip title={t('Account') as string}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={profileObj.name} src={profileObj.imageUrl} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{
          mt: 10,
        }}
        id='menu-appbar'
        anchorEl={userAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(userAnchorEl)}
        onClose={handleCloseUserMenu}>
        <Container>
          <Tooltip title={t('Toggle dark') as string} placement='left'>
            <Typography variant='h5'>
              🌞
              <Switch checked={dark} onChange={() => toggleDark()} />
              🌛
            </Typography>
          </Tooltip>
        </Container>
        <Box p={3} key='Google Logout' onClick={handleCloseUserMenu}>
          <GoogleLogout
            clientId={clientId}
            buttonText={t('Logout')}
            onLogoutSuccess={() => dispatch(resetUser())}
          />
        </Box>
      </Menu>
    </Box>
  ) : (
    <Box>
      <Tooltip title={t('Account') as string}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{
          mt: 10,
        }}
        id='menu-appbar'
        anchorEl={userAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(userAnchorEl)}
        onClose={handleCloseUserMenu}>
        <Container>
          <Tooltip title={t('Toggle dark') as string} placement='left'>
            <Typography variant='h5'>
              🌞
              <Switch checked={dark} onChange={() => toggleDark()} />
              🌛
            </Typography>
          </Tooltip>
        </Container>
        <Box p={3} key='Google Logout' onClick={handleCloseUserMenu}>
          <GoogleLogin
            clientId={clientId}
            buttonText={t('Login')}
            onSuccess={e => dispatch(setUser(e))}
            onFailure={() => dispatch(resetUser())}
            cookiePolicy='single_host_origin'
            isSignedIn={true}
          />
        </Box>
      </Menu>
    </Box>
  )
}

export default UserMenu
