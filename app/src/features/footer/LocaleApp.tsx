import {useState} from "react"
import {useTranslation} from "react-i18next"

import LanguageIcon from "@mui/icons-material/Language"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Menu, {MenuProps} from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Tooltip from "@mui/material/Tooltip"

import LocalStorage from "../../utils/LocalStorage"
import {languageOptions} from "../../shared/constants"

const languageStorage = new LocalStorage("preferred-lng")

const LocaleApp = () => {
  const {i18n, t} = useTranslation()
  const {changeLanguage, language} = i18n

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const onClose = () => setAnchorEl(null)

  const handleClick = (key: string) => {
    languageStorage.set(key)
    onClose()
    changeLanguage(key)
  }

  const toggleButton = (
    <Tooltip title={t("Change language") as string} placement="top">
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
        <LanguageIcon />
        &nbsp;{language}
      </IconButton>
    </Tooltip>
  )

  const menuItems = languageOptions.map(({key, name}) => (
    <MenuItem key={key} onClick={() => handleClick(key)}>
      {t(name)}
    </MenuItem>
  ))

  const menuProps: MenuProps = {
    anchorEl,
    anchorOrigin: {
      horizontal: "center",
      vertical: "top",
    },
    keepMounted: true,
    onClose,
    open: Boolean(anchorEl),
    transformOrigin: {
      horizontal: "center",
      vertical: "bottom",
    },
  }

  return (
    <Box>
      {toggleButton}
      <Menu {...menuProps}>{menuItems}</Menu>
    </Box>
  )
}

export default LocaleApp
