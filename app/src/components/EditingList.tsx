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
import ClearIcon from '@mui/icons-material/Clear'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import MenuItem from '@mui/material/MenuItem'
import SearchIcon from '@mui/icons-material/Search'
import Snackbar from '@mui/material/Snackbar'

import SelectionsList from './SelectionsList'
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
        {selections.length < 10 && (
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
              error={
                Boolean(appliedQuery) &&
                appliedQuery === wikiQuery &&
                availableOptions.length === 0
              }
              inputProps={{
                maxLength: 25,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='start'>
                    {Boolean(wikiQuery) ? (
                      <ClearIcon
                        sx={{ cursor: 'pointer' }}
                        onClick={resetSearch}
                      />
                    ) : (
                      <SearchIcon />
                    )}
                  </InputAdornment>
                ),
              }}
              label={t('Search players')}
              value={wikiQuery}
              onChange={e => setWikiQuery(e.target.value)}
              helperText={t(
                availableOptions.length
                  ? `Showing results for '{{query}}'`
                  : Boolean(appliedQuery) && appliedQuery === wikiQuery
                  ? `No results for '{{query}}'`
                  : '',
                { query: appliedQuery }
              )}
            />
          </Box>
        )}
        {isLoading && (
          <Box mt={8}>
            <CircularProgress />
          </Box>
        )}
        {availableOptions.length > 0 && !isLoading && (
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
      </Box>
      {selections.length > 0 && (
        <SelectionsList selections={selections} setSelections={setSelections} />
      )}
    </Box>
  )
}

export default EditingList
