import { useEffect, useState, SyntheticEvent } from 'react'
import { useTranslation } from 'react-i18next'

import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Input from '@mui/material/Input'
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
  list: Selection[]
  sport: string
}

const EditingList = ({ list, sport }: EditingListProps) => {
  const localStorageService = new LocalStorageService()
  const { t } = useTranslation()
  const [appliedQuery, setAppliedQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarText, setSnackbarText] = useState('')
  const [availableOptions, setAvailableOptions] = useState<Selection[]>([])
  const initialSelections = localStorageService.get('wip_list') || []
  const [selections, setSelections] = useState<Selection[]>(
    list || initialSelections
  )
  const [wikiQuery, setWikiQuery] = useState('')
  const debouncedQuery = useDebounce(wikiQuery, 500)

  const resetSearch = () => {
    setWikiQuery('')
    setAppliedQuery('')
    setAvailableOptions([])
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
      setAppliedQuery(res.query)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = (clickedTitle: string) => {
    if (selections.some(({ title }) => title === clickedTitle)) {
      setSnackbarText(clickedTitle)
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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        justifyContent: 'center',
        mx: 'auto',
        textAlign: 'center',
      }}>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}>
        <Alert severity='error'>
          {`You already added ${snackbarText}`}
          <Button
            sx={{ ml: 3 }}
            size='small'
            variant='outlined'
            onClick={resetSearch}>
            Clear Query
          </Button>
        </Alert>
      </Snackbar>
      <Box sx={{ maxWidth: '20rem', mx: 'auto' }}>
        <Box component='form' onSubmit={handleSubmit} noValidate>
          <Input
            autoFocus
            placeholder='Search players'
            value={wikiQuery}
            onChange={e => setWikiQuery(e.target.value)}
          />
          <IconButton type='submit'>
            <SearchIcon />
          </IconButton>
          {(Boolean(wikiQuery) || availableOptions.length > 0) && (
            <IconButton onClick={resetSearch}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        {isLoading ? (
          <CircularProgress sx={{ my: 4 }} />
        ) : availableOptions.length ? (
          <List sx={{ mt: 1 }}>
            {availableOptions.map(
              ({ title, thumbnail: { height, source, width } }) => (
                <MenuItem key={title} onClick={() => handleClick(title)}>
                  {Boolean(width) ? (
                    <Avatar
                      sx={{
                        borderRadius: '40%',
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
        ) : appliedQuery && appliedQuery === wikiQuery ? (
          <Typography sx={{ mt: 3 }} variant='h6'>
            {t(`No results for '{{query}}'`, { query: appliedQuery })}
          </Typography>
        ) : null}
      </Box>
      {selections.length > 0 && (
        <SelectionsList selections={selections} setSelections={setSelections} />
      )}
    </Box>
  )
}

export default EditingList
