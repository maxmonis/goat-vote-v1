import { useState, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  GoogleLogin,
  GoogleLogout,
} from 'react-google-login'
import { useTranslation } from 'react-i18next'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/system/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectUser, setUser, resetUser } from '../features/auth/authSlice'

const UserMenu = () => {
  const { profileObj } = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorEl(null)
  }

  const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID
  if (typeof clientId !== 'string') return null

  return profileObj ? (
    <Box>
      <Tooltip title={t('Account') as string}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: 1 }}>
          <Avatar alt={profileObj.name} src={profileObj.imageUrl} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{
          mt: 10,
        }}
        id='menu-appbar'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleCloseUserMenu}>
        <MenuItem
          component={Link}
          to='new-list'
          key={'New List'}
          onClick={handleCloseUserMenu}>
          {t('New List')}
        </MenuItem>
        <MenuItem key='Google Logout' onClick={handleCloseUserMenu}>
          <GoogleLogout
            clientId={clientId}
            buttonText={t('Logout')}
            onLogoutSuccess={() => dispatch(resetUser())}
          />
        </MenuItem>
      </Menu>
    </Box>
  ) : (
    <GoogleLogin
      clientId={clientId}
      buttonText={t('Login')}
      onSuccess={e => dispatch(setUser(e))}
      onFailure={() => dispatch(resetUser())}
      cookiePolicy='single_host_origin'
      isSignedIn={true}
    />
  )
}

export default UserMenu
