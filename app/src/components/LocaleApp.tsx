import { useState, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageIcon from '@mui/icons-material/Language'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

const LocaleApp = () => {
  const { i18n, t } = useTranslation()
  const { changeLanguage } = i18n
  const [language, setLanguage] = useState('en')
  const languages = ['en', 'es']

  const [anchorElLocales, setAnchorElLocales] = useState<null | HTMLElement>(
    null
  )

  const handleOpenLocaleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElLocales(event.currentTarget)
  }

  const handleCloseLocaleMenu = () => {
    setAnchorElLocales(null)
  }

  const handleClick = (key: string) => {
    handleCloseLocaleMenu()
    setLanguage(key)
    changeLanguage(key)
  }

  return (
    <Box>
      <Tooltip title={'Language'} placement='right-end'>
        <IconButton size='small' onClick={handleOpenLocaleMenu}>
          <LanguageIcon />
          &nbsp;{language}
        </IconButton>
      </Tooltip>
      <Menu
        id='menu-locales'
        anchorEl={anchorElLocales}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={Boolean(anchorElLocales)}
        onClose={handleCloseLocaleMenu}>
        {languages.map(key => (
          <MenuItem key={key} onClick={() => handleClick(key)}>
            {t(key)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default LocaleApp
