import { useState, useEffect, forwardRef, ReactElement, Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Navigate } from 'react-router-dom'

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
import { selectUser } from '../auth/authSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { addRanking } from './rankingSlice'
import { Selection, Ranking, Sport } from '../../interfaces'
import { options } from '../../constants'

const isValidSport = (key?: string): key is Sport =>
  typeof key === 'string' &&
  ['basketball', 'baseball', 'football'].includes(key)

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement
    },
    ref: Ref<unknown>
  ) => <Slide direction='up' ref={ref} {...props} />
)

const NewListApp = () => {
  const { profileObj } = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
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

  useEffect(() => reset(), [selectedSport])

  const handleSave = async () => {
    if (
      typeof profileObj?.googleId === 'string' &&
      typeof profileObj?.name === 'string'
    ) {
      const ranking: Ranking = {
        creatorID: profileObj.googleId,
        creatorName: profileObj.name,
        category: selectedSport,
        timeframe: selectedTimeframe,
        subcategory: selectedCategory,
        titles: selections.map(({ title }) => title).join('|'),
      }
      try {
        await dispatch(addRanking(ranking))
        reset()
      } catch (error) {
        console.error(error)
      }
    }
  }

  return isValidSport(sport) ? (
    <Container
      maxWidth='xl'
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
            {getTimeframeText(selectedTimeframe)}
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
                  {getTimeframeText(timeframe)}
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
            onClick={handleSave}
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
  ) : (
    <Navigate to='/basketball' />
  )
}

export default NewListApp
