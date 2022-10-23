import {
  Dispatch,
  FormEvent,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react"
import {useTranslation} from "react-i18next"

import Alert from "@mui/material/Alert"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import ClearIcon from "@mui/icons-material/Clear"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import List from "@mui/material/List"
import MenuItem from "@mui/material/MenuItem"
import SearchIcon from "@mui/icons-material/Search"
import Snackbar from "@mui/material/Snackbar"

import SelectionsList from "./SelectionsList"
import useDebounce from "../../hooks/useDebounce"
import {getInitials} from "../../utils/helpers"
import searchWiki from "../../utils/searchWiki"
import {Selection, Sport} from "../../shared/models"

type EditingListProps = {
  category: string
  selections: Selection[]
  setSelections: Dispatch<SetStateAction<Selection[]>>
  sport: Sport
  timeframe: string
}

const EditingList = ({
  category,
  selections,
  setSelections,
  sport,
  timeframe,
}: EditingListProps) => {
  const {t} = useTranslation()
  const [appliedQuery, setAppliedQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarText, setSnackbarText] = useState("")
  const [availableOptions, setAvailableOptions] = useState<Selection[]>([])
  const [wikiQuery, setWikiQuery] = useState("")
  const debouncedQuery = useDebounce(wikiQuery, 700)

  useEffect(() => {
    if (debouncedQuery.length > 3 && availableOptions.length === 0) {
      fetchOptions(wikiQuery)
    }
    //eslint-disable-next-line
  }, [debouncedQuery])

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={10}
      justifyContent="center"
      mx="auto"
      textAlign="center"
    >
      <Snackbar
        autoHideDuration={3000}
        onClose={handleClose}
        open={showSnackbar}
      >
        <Alert severity="error">
          {snackbarText}
          <Button
            onClick={resetSearch}
            size="small"
            sx={{ml: 3}}
            variant="outlined"
          >
            {t("Clear query")}
          </Button>
        </Alert>
      </Snackbar>
      <Box maxWidth="xs" mx="auto">
        {selections.length < 10 && (
          <Box
            alignItems="center"
            component="form"
            display="flex"
            gap={1}
            noValidate
            onSubmit={handleSubmit}
          >
            <TextField
              autoFocus
              autoComplete="off"
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
                  <InputAdornment position="end">
                    {Boolean(wikiQuery) ? (
                      <ClearIcon
                        onClick={resetSearch}
                        sx={{cursor: "pointer"}}
                      />
                    ) : (
                      <SearchIcon />
                    )}
                  </InputAdornment>
                ),
              }}
              helperText={t(
                availableOptions.length
                  ? `Showing results for '{{query}}'`
                  : Boolean(appliedQuery) && appliedQuery === wikiQuery
                  ? `No results for '{{query}}'`
                  : "",
                {query: appliedQuery}
              )}
              label={t("Search players")}
              onChange={(e) => setWikiQuery(e.target.value)}
              value={wikiQuery}
            />
          </Box>
        )}
        {isLoading && (
          <Box mt={8}>
            <CircularProgress />
          </Box>
        )}
        {availableOptions.length > 0 && !isLoading && (
          <List sx={{mt: 3}}>
            {availableOptions.map(({title, source}) => (
              <MenuItem key={title} onClick={() => handleClick(title)}>
                <Box
                  display="flex"
                  flexShrink={0}
                  justifyContent="center"
                  sx={{width: {xs: 45, sm: 60}}}
                >
                  {Boolean(source) ? (
                    <Avatar
                      alt={title}
                      src={source}
                      sx={{
                        height: 40,
                        maxWidth: 30,
                        width: "auto",
                      }}
                      variant="rounded"
                    />
                  ) : (
                    <Avatar
                      sx={{
                        height: 30,
                        my: 1,
                        px: 4,
                        width: 30,
                      }}
                      variant="rounded"
                    >
                      {getInitials(title)}
                    </Avatar>
                  )}
                </Box>
                {title.split(" (")[0]}
              </MenuItem>
            ))}
          </List>
        )}
      </Box>
      {selections.length > 0 && (
        <SelectionsList {...{selections, setSelections}} />
      )}
    </Box>
  )

  function resetSearch() {
    setWikiQuery("")
    setAppliedQuery("")
    setAvailableOptions([])
    setSnackbarText("")
    setShowSnackbar(false)
  }

  function handleClose(_event?: SyntheticEvent | Event, reason?: string) {
    if (reason !== "clickaway") setShowSnackbar(false)
  }

  async function fetchOptions(query: string) {
    if (isLoading) return
    setIsLoading(true)
    try {
      const res = await searchWiki({query, sport, category, timeframe})
      setAvailableOptions(res.options)
      setAppliedQuery(res.term)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleClick(clickedTitle: string) {
    if (selections.some(({title}) => title === clickedTitle)) {
      setSnackbarText(
        t("{{option}} is already in the list", {option: clickedTitle})
      )
      setShowSnackbar(true)
    } else {
      const selectedOption = availableOptions.find(
        ({title}) => title === clickedTitle
      )
      if (selectedOption) setSelections([...selections, selectedOption])
      setWikiQuery("")
      setAppliedQuery("")
      setAvailableOptions([])
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (wikiQuery.length > 2) fetchOptions(wikiQuery)
  }
}

export default EditingList
