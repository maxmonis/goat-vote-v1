import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const Footer = () => {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        mt: 40,
        py: 0,
        px: 4,
        textAlign: 'center',
      }}>
      <Typography variant='body1'>
        {t('Search powered by')}{' '}
        <Link
          href='https://www.mediawiki.org/wiki/API:Main_page'
          target='_blank'
          rel='noopener noreferrer'>
          Wikipedia
        </Link>
      </Typography>
      <Typography
        sx={{ my: 2 }}
        component={Link}
        variant='body2'
        href='https://github.com/maxmonis'
        target='_blank'
        rel='noopener noreferrer'>
        © Max Monis 2022
      </Typography>
    </Box>
  )
}

export default Footer
