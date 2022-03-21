import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'

import EditingList from '../../components/EditingList'

interface SportOptions {
  timeframes: string[]
  categories: string[]
}

interface Options {
  [key: string]: SportOptions
}

const defaultTimeframes = [
  'all-time',
  'pre-1960',
  '1960s',
  '1970s',
  '1980s',
  '1990s',
  '2000s',
  '2010s',
  '2020s',
  '20th century',
  '21st century',
]
const baseballTimeframes = [...defaultTimeframes]
baseballTimeframes.splice(1, 1, 'pre-1920', '1920s', '1930s', '1940s', '1950s')

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
  basketball: {
    timeframes: defaultTimeframes,
    categories: basketballCategories,
  },
  football: {
    timeframes: defaultTimeframes,
    categories: footballCategories,
  },
  baseball: {
    timeframes: baseballTimeframes,
    categories: baseballCategories,
  },
}

const NewListApp = () => {
  const { t } = useTranslation()
  const [selectedSport, setSelectedSport] = useState(Object.keys(options)[0])
  const [selectedTimeframe, setSelectedTimeframe] = useState('all-time')
  const [selectedCategory, setSelectedCategory] = useState('player')
  return (
    <Container
      maxWidth='lg'
      sx={{
        display: 'flex',
        gap: 12,
        flexDirection: 'column',
        justifyContent: 'space-between',
        mb: 0,
        mt: 16,
        mx: 'auto',
        px: 4,
        textAlign: 'center',
      }}>
      <Typography variant='h2'>{t('New List')}</Typography>
      <Box
        sx={{
          px: 8,
          ' .MuiOutlinedInput-root': {
            m: 1,
          },
        }}>
        <Select
          value={selectedSport}
          onChange={e => setSelectedSport(e.target.value)}>
          {Object.keys(options).map(sport => (
            <MenuItem key={sport} value={sport}>
              {sport}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={selectedTimeframe}
          onChange={e => setSelectedTimeframe(e.target.value)}>
          {options[selectedSport].timeframes.map(timeframe => (
            <MenuItem key={timeframe} value={timeframe}>
              {timeframe}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}>
          {options[selectedSport].categories.map(category => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <EditingList list={[]} sport={selectedSport} />
    </Container>
  )
}

export default NewListApp
