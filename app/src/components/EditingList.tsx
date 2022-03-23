import {
  useEffect,
  useState,
  SyntheticEvent,
  Dispatch,
  SetStateAction,
} from 'react'
import { useTranslation } from 'react-i18next'

import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import MenuItem from '@mui/material/MenuItem'
import SearchIcon from '@mui/icons-material/Search'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'

import SelectionsList from './SelectionsList'
import LocalStorageService from '../services/localStorageService'
import useDebounce from '../hooks/useDebounce'
import { getInitials } from '../functions/helpers'
import searchWiki from '../functions/searchWiki'

interface Thumbnail {
  source: string
  height: string
  width: string
}

interface Selection {
  title: string
  thumbnail: Thumbnail
}

interface EditingListProps {
  selections: Selection[]
  setSelections: Dispatch<SetStateAction<Selection[]>>
  sport: string
}

const EditingList = ({
  selections,
  setSelections,
  sport,
}: EditingListProps) => {
  const localStorageService = new LocalStorageService()
  const { t } = useTranslation()
  const [appliedQuery, setAppliedQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarText, setSnackbarText] = useState('')
  const [availableOptions, setAvailableOptions] = useState<Selection[]>([])
  const [wikiQuery, setWikiQuery] = useState('')
  const debouncedQuery = useDebounce(wikiQuery, 500)

  const resetSearch = () => {
    setWikiQuery('')
    setAppliedQuery('')
    setAvailableOptions([])
    setSnackbarText('')
    setShowSnackbar(false)
  }

  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return
    setShowSnackbar(false)
  }

  const fetchOptions = async (query: string) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const res = await searchWiki(query, sport)
      setAvailableOptions(res.options)
      setAppliedQuery(res.term)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = (clickedTitle: string) => {
    if (selections.some(({ title }) => title === clickedTitle)) {
      setSnackbarText(
        t('{{option}} is already in the list', { option: clickedTitle })
      )
      setShowSnackbar(true)
    } else {
      const selectedOption = availableOptions.find(
        ({ title }) => title === clickedTitle
      )
      if (selectedOption) setSelections([...selections, selectedOption])
      setWikiQuery('')
      setAppliedQuery('')
      setAvailableOptions([])
    }
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (wikiQuery.length > 2) fetchOptions(wikiQuery)
  }

  useEffect(() => {
    localStorageService.set('wip_list', selections)
    //eslint-disable-next-line
  }, [selections])

  useEffect(() => {
    if (debouncedQuery.length > 3 && !availableOptions.length)
      fetchOptions(wikiQuery)
    //eslint-disable-next-line
  }, [debouncedQuery])

  return (
    <Box
      display='flex'
      flexDirection='column'
      gap={10}
      justifyContent='center'
      mx='auto'
      textAlign='center'>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}>
        <Alert severity='error'>
          {snackbarText}
          <Button
            sx={{ ml: 3 }}
            size='small'
            variant='outlined'
            onClick={resetSearch}>
            {t('Clear query')}
          </Button>
        </Alert>
      </Snackbar>
      <Box maxWidth='xs' mx='auto'>
        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          alignItems='center'
          display='flex'
          gap={1}>
          <TextField
            autoFocus
            autoComplete='off'
            label={t('Search players')}
            value={wikiQuery}
            onChange={e => setWikiQuery(e.target.value)}
          />
          <IconButton type='submit'>
            <SearchIcon />
          </IconButton>
        </Box>
        {Boolean(appliedQuery) && (
          <Typography
            mt={1}
            maxWidth='15rem'
            whiteSpace='break-spaces'
            variant='body2'
            color={availableOptions.length ? '' : 'error.light'}
            textAlign='left'>
            {t(
              availableOptions.length
                ? `Showing results for '{{query}}'`
                : `No results for '{{query}}'`,
              { query: appliedQuery }
            )}
          </Typography>
        )}
        {isLoading && (
          <Box mt={8}>
            <CircularProgress />
          </Box>
        )}
        {availableOptions.length > 0 && (
          <List sx={{ mt: 3 }}>
            {availableOptions.map(
              ({ title, thumbnail: { height, source, width } }) => (
                <MenuItem key={title} onClick={() => handleClick(title)}>
                  {Boolean(width) ? (
                    <Avatar
                      sx={{
                        height: Number(height) / 2,
                        mr: 2,
                        width: Number(width) / 2,
                      }}
                      alt={title}
                      src={source}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        height: 40,
                        mr: 2,
                        width: 40,
                      }}>
                      {getInitials(title)}
                    </Avatar>
                  )}
                  {title}
                </MenuItem>
              )
            )}
          </List>
        )}
        {Boolean(appliedQuery) && (
          <Box mt={5}>
            <Button size='small' onClick={resetSearch}>
              {t('Clear query')}
            </Button>
          </Box>
        )}
      </Box>
      {selections.length > 0 && (
        <SelectionsList selections={selections} setSelections={setSelections} />
      )}
    </Box>
  )
}

export default EditingList
