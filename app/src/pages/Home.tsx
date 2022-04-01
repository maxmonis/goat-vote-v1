import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectRankings, getAllRankings } from '../features/create/rankingSlice'

type Sport = 'basketball' | 'baseball' | 'football'

interface Ranking {
  creatorID: string
  creatorName: string
  category: Sport
  timeframe: string
  subcategory: string
  titles: String
}

interface SavedRanking extends Ranking {
  _id: string
}

const Home = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const rankings: SavedRanking[] = useAppSelector(selectRankings)

  const getTimeframeText = (key: string) => {
    switch (key) {
      case 'all-time':
        return t('of all time')
      case 'currently':
        return t('right now')
      case 'pre-1920':
        return t('before 1920')
      case 'pre-1960':
        return t('before 1960')
      default:
        return t('of the {{decade}}', { decade: key })
    }
  }

  useEffect(() => {
    dispatch(getAllRankings())
    // eslint-disable-next-line
  }, [])

  return (
    <Box py={5}>
      <Typography textAlign='center' variant='h1'>
        Who's the GOAT?
      </Typography>
      {rankings.map(
        ({ _id, category, timeframe, subcategory, creatorName, titles }) => (
          <Box key={_id} my={3}>
            <Typography variant='body1'>
              The best {subcategory} in {category} {getTimeframeText(timeframe)}
            </Typography>
            <Typography variant='body2'>by {creatorName}</Typography>
            {titles.split('|').map((title: string) => (
              <Typography variant='body1' key={title}>
                {title}
              </Typography>
            ))}
          </Box>
        )
      )}
    </Box>
  )
}

export default Home
