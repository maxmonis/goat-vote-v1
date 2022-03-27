import { useState, useEffect, forwardRef, ReactElement, Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Slide from '@mui/material/Slide'
import Typography from '@mui/material/Typography'
import { TransitionProps } from '@mui/material/transitions'

import EditingList from '../../components/EditingList'

interface SportOptions {
  timeframes: string[]
  categories: string[]
}

type Sport = 'basketball' | 'baseball' | 'football'

type Options = {
  [key in Sport]: SportOptions
}

interface Selection {
  source: string
  title: string
}

const isValidSport = (key?: string): key is Sport =>
  typeof key === 'string' &&
  ['basketball', 'baseball', 'football'].includes(key)

const defaultTimeframes = [
  'all-time',
  '21st century',
  '20th century',
  '2020s',
  '2010s',
  '2000s',
  '1990s',
  '1980s',
  '1970s',
  '1960s',
  'pre-1960',
]
const baseballTimeframes = [
  ...defaultTimeframes.slice(0, -1),
  ...['1950s', '1940s', '1930s', '1920s', 'pre-1920'],
]

const defaultCategories = ['player', 'offensive player', 'defensive player']
const basketballCategories = [
  ...defaultCategories,
  'point guard',
  'shooting guard',
  'small forward',
  'power forward',
  'center',
]
const footballCategories = [
  ...defaultCategories,
  'quarterback',
  'skill position player',
  'offensive lineman',
  'defensive lineman',
  'linebacker',
  'defensive back',
]
const baseballCategories = [
  ...defaultCategories,
  'pitcher',
  'catcher',
  'corner infielder',
  'middle infielder',
  'outfielder',
]

const options: Options = {
  baseball: {
    timeframes: baseballTimeframes,
    categories: baseballCategories,
  },
  basketball: {
    timeframes: defaultTimeframes,
    categories: basketballCategories,
  },
  football: {
    timeframes: defaultTimeframes,
    categories: footballCategories,
  },
}

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement
    },
    ref: Ref<unknown>
  ) => <Slide direction='up' ref={ref} {...props} />
)

const NewListApp = () => {
  const { t } = useTranslation()
  const { sport } = useParams()
  const selectedSport = isValidSport(sport) ? sport : 'basketball'
  const [selectedTimeframe, setSelectedTimeframe] = useState('all-time')
  const [selectedCategory, setSelectedCategory] = useState('player')
  const [selections, setSelections] = useState<Selection[]>([])
  const [isEditing, setIsEditing] = useState(selections.length > 0)
  const [isDialogOpen, setDialogVisibility] = useState(false)

  const handleClickOpen = () => setDialogVisibility(true)
  const handleClose = () => setDialogVisibility(false)

  const changeCategory = () => {
    setIsEditing(false)
    setSelections([])
    handleClose()
  }

  const reset = () => {
    setSelectedCategory('player')
    setSelectedTimeframe('all-time')
    setSelections([])
    setIsEditing(false)
  }

  useEffect(() => reset(), [selectedSport])

  return (
    <Container
      maxWidth='lg'
      sx={{
        display: 'flex',
        gap: 12,
        flexDirection: 'column',
        justifyContent: 'center',
        m: 'auto',
        minHeight: '75vh',
        py: 12,
        textAlign: 'center',
      }}>
      {isEditing ? (
        <Box>
          <Typography variant='h2' sx={{ maxWidth: '20ch', mx: 'auto' }}>
            The best {selectedCategory} in {selectedSport}{' '}
            {selectedTimeframe.match(/-/) ? 'of' : 'of the'} {selectedTimeframe}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant='h1'>
            {selectedSport.charAt(0).toUpperCase() +
              selectedSport.substring(1).toLowerCase()}
          </Typography>
          <Typography variant='h2'>{t('New List')}</Typography>
          <Box
            display='flex'
            flexWrap='wrap'
            gap={2}
            justifyContent='center'
            mt={8}>
            <Select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}>
              {options[selectedSport].categories.map(category => (
                <MenuItem key={category} value={category}>
                  The best {category}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={selectedTimeframe}
              onChange={e => setSelectedTimeframe(e.target.value)}>
              {options[selectedSport].timeframes.map(timeframe => (
                <MenuItem key={timeframe} value={timeframe}>
                  {timeframe.match(/-/) ? 'of' : 'of the'} {timeframe}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      )}
      {isEditing ? (
        <EditingList
          selections={selections}
          setSelections={setSelections}
          sport={selectedSport}
          category={selectedCategory}
          timeframe={selectedTimeframe}
        />
      ) : (
        <Button
          onClick={() => setIsEditing(true)}
          variant='contained'
          size='large'
          sx={{
            mx: 'auto',
            width: 'min(80vw, 20rem)',
          }}>
          {t('Add Players')}
        </Button>
      )}
      <Box width='min(80vw, 20rem)' mx='auto'>
        {selections.length > 0 && (
          <Button
            variant='contained'
            size='large'
            sx={{
              width: '100%',
              flexGrow: 1,
              mb: 50,
            }}>
            {t('Save')}
          </Button>
        )}
        {isEditing && (
          <Button
            onClick={() =>
              selections.length ? handleClickOpen() : changeCategory()
            }
            size='small'>
            {t('Change Category')}
          </Button>
        )}
        <Dialog
          open={isDialogOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby='change-category-description'>
          <DialogTitle>{'Discard changes?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='change-category-description'>
              Changing categories will delete your current list. This action is
              irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={changeCategory}>Discard</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  )
}

export default NewListApp
