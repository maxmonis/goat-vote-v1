import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'

import EditingList from '../../components/EditingList'
import LocalStorageService from '../../services/localStorageService'

interface SportOptions {
  timeframes: string[]
  categories: string[]
}

interface Options {
  [key: string]: SportOptions
}

interface Thumbnail {
  source: string
  height: string
  width: string
}

interface Selection {
  title: string
  thumbnail: Thumbnail
}

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

const NewListApp = () => {
  const localStorageService = new LocalStorageService()
  const { t } = useTranslation()
  const [selectedSport, setSelectedSport] = useState('basketball')
  const [selectedTimeframe, setSelectedTimeframe] = useState('all-time')
  const [selectedCategory, setSelectedCategory] = useState('player')
  const initialSelections =
    (localStorageService.get('wip_list') as Selection[]) || []
  const [selections, setSelections] = useState<Selection[]>(initialSelections)
  const [isEditing, setIsEditing] = useState(selections.length > 0)

  const handleClick = () => {
    setIsEditing(false)
    setSelections([])
  }

  useEffect(() => {
    localStorageService.set('wip_list', selections)
    //eslint-disable-next-line
  }, [selections])

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
          <Typography variant='h1'>{t('New List')}</Typography>
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
              value={selectedSport}
              onChange={e => setSelectedSport(e.target.value)}>
              {Object.keys(options).map(sport => (
                <MenuItem key={sport} value={sport}>
                  in {sport}
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
              mb: 80,
            }}>
            {t('Save')}
          </Button>
        )}
        {isEditing && (
          <Button onClick={handleClick} size='small'>
            {t('Change Category')}
          </Button>
        )}
      </Box>
    </Container>
  )
}

export default NewListApp
