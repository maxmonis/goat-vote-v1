import { Options } from './interfaces'

const defaultTimeframes = [
  'all-time',
  'currently',
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

export const options: Options = {
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

export const pages = [
  { name: 'Baseball', route: '/baseball' },
  { name: 'Basketball', route: '/basketball' },
  { name: 'Football', route: '/football' },
]

export const languageOptions = [
  { key: 'en', name: 'English' },
  { key: 'es', name: 'Spanish' },
]
