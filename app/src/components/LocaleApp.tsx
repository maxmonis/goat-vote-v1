import {useState, MouseEvent} from "react"
import {useTranslation} from "react-i18next"
import LanguageIcon from "@mui/icons-material/Language"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Tooltip from "@mui/material/Tooltip"

import LocalStorageService from "../services/LocalStorageService"
import {languageOptions} from "../constants"

const LocaleApp = () => {
  const localLanguage = new LocalStorageService("preferred-lng")
  const {i18n, t} = useTranslation()
  const {changeLanguage, language} = i18n

  const [anchorElLocales, setAnchorElLocales] = useState<null | HTMLElement>(
    null
  )

  return (
    <Box>
      <Tooltip title={t("Change language") as string} placement="top">
        <IconButton size="small" onClick={handleOpenLocaleMenu}>
          <LanguageIcon />
          &nbsp;{language}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElLocales}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        id="menu-locales"
        keepMounted
        onClose={handleCloseLocaleMenu}
        open={Boolean(anchorElLocales)}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {languageOptions.map(({key, name}) => (
          <MenuItem key={key} onClick={() => handleClick(key)}>
            {t(name)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )

  function handleOpenLocaleMenu(event: MouseEvent<HTMLElement>) {
    setAnchorElLocales(event.currentTarget)
  }

  function handleCloseLocaleMenu() {
    setAnchorElLocales(null)
  }

  function handleClick(key: string) {
    localLanguage.set(key)
    handleCloseLocaleMenu()
    changeLanguage(key)
  }
}

export default LocaleApp
