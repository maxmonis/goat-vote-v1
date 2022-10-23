import {useTranslation} from "react-i18next"

import Box from "@mui/material/Box"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

import LocaleApp from "./LocaleApp"

const Footer = () => {
  const {t} = useTranslation()

  const searchText = (
    <Typography variant="body1">
      {t("Search powered by")}{" "}
      <Link
        href="https://www.mediawiki.org/wiki/API:Main_page"
        rel="noopener noreferrer"
        target="_blank"
      >
        Wikipedia
      </Link>
    </Typography>
  )

  const copyrightText = (
    <Typography
      component={Link}
      href="https://github.com/maxmonis"
      mb={6}
      rel="noopener noreferrer"
      target="_blank"
      variant="body2"
    >
      © Max Monis {new Date().getFullYear()}
    </Typography>
  )

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      justifyContent="center"
      mt={40}
      px={4}
      py={0}
      textAlign="center"
    >
      <LocaleApp />
      {searchText}
      {copyrightText}
    </Box>
  )
}

export default Footer
