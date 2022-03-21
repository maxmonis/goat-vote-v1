import { useState, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  GoogleLogin,
  GoogleLogout,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import { useTranslation } from 'react-i18next'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/system/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectUser, setUser, resetUser } from '../features/auth/authSlice'
import refreshToken from '../functions/refreshToken'

const UserMenu = () => {
  const { name, imageUrl } = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const isValidResponse = (
    res: GoogleLoginResponse | GoogleLoginResponseOffline
  ): res is GoogleLoginResponse =>
    typeof (res as GoogleLoginResponse) !== 'undefined'

  const handleSuccess = (
    res: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if (isValidResponse(res)) {
      refreshToken(res)
      const updatedUser = res.profileObj
      dispatch(setUser(updatedUser))
    }
  }

  const handleLogoutSuccess = () => {
    dispatch(resetUser())
  }

  const handleFailure = (res: GoogleLoginResponse) => {
    console.info('Login failed with this response: ', res)
    dispatch(resetUser())
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorEl(null)
  }

  const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID
  if (!clientId) return null

  return name ? (
    <Box>
      <Tooltip title={t('Account') as string}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: 1 }}>
          <Avatar alt={name} src={imageUrl} />
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
            onLogoutSuccess={handleLogoutSuccess}
          />
        </MenuItem>
      </Menu>
    </Box>
  ) : (
    <GoogleLogin
      clientId={clientId}
      buttonText={t('Login')}
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      cookiePolicy='single_host_origin'
      isSignedIn={true}
    />
  )
}

export default UserMenu
