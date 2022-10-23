import {GoogleLogin, GoogleLogout} from "react-google-login"
import {useState} from "react"
import {useTranslation} from "react-i18next"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/system/Box"
import IconButton from "@mui/material/IconButton"
import Switch from "@mui/material/Switch"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import {selectUser, setUser, resetUser} from "../auth/authSlice"
import {useAppSelector, useAppDispatch} from "../../app/hooks"
import NavBarMenu from "./NavBarMenu"

const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID

type UserMenuProps = {
  dark: boolean
  toggleDark: () => void
}

const UserMenu = ({dark, toggleDark}: UserMenuProps) => {
  const {t} = useTranslation()

  const {profileObj} = useAppSelector(selectUser)
  const dispatch = useAppDispatch()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const onClose = () => setAnchorEl(null)

  const userMenuButton = (
    <Tooltip title={t("Account") as string}>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{p: 0}}>
        <Avatar alt={profileObj?.name} src={profileObj?.imageUrl} />
      </IconButton>
    </Tooltip>
  )

  const darkModeSwitch = (
    <Tooltip placement="left" title={t("Toggle dark") as string}>
      <Typography px={4} variant="h5">
        🌞
        <Switch checked={dark} onChange={toggleDark} />
        🌛
      </Typography>
    </Tooltip>
  )

  const googleAccountButton = !clientId ? null : (
    <Box p={3} onClick={onClose}>
      {profileObj ? (
        <GoogleLogout
          buttonText={t("Logout")}
          clientId={clientId}
          onLogoutSuccess={() => dispatch(resetUser())}
        />
      ) : (
        <GoogleLogin
          buttonText={t("Login")}
          clientId={clientId}
          cookiePolicy="single_host_origin"
          isSignedIn={true}
          onFailure={() => dispatch(resetUser())}
          onSuccess={(e) => dispatch(setUser(e))}
        />
      )}
    </Box>
  )

  return (
    <>
      {userMenuButton}
      <NavBarMenu horizontal="right" {...{anchorEl, onClose}}>
        {darkModeSwitch}
        {googleAccountButton}
      </NavBarMenu>
    </>
  )
}

export default UserMenu
