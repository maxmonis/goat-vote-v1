import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

import { getInitials } from '../functions/helpers'
import { Typography } from '@mui/material'

interface Selection {
  height: string
  source: string
  title: string
  width: string
}

interface SelectionsListProps {
  selections: Selection[]
  setSelections: React.Dispatch<React.SetStateAction<Selection[]>>
}

const SelectionsList = ({ selections, setSelections }: SelectionsListProps) => {
  const removeSelection = (titleToRemove: string) => {
    setSelections(selections.filter(({ title }) => title !== titleToRemove))
  }
  const handleDragEnd = ({ destination, source, draggableId }: DropResult) => {
    if (destination && destination.index !== source.index) {
      const selectionTitles = selections.map(({ title }) => title)
      selectionTitles.splice(source.index, 1)
      selectionTitles.splice(destination.index, 0, draggableId)
      const updatedList = []
      for (const selectionTitle of selectionTitles) {
        for (const selection of selections) {
          if (selection.title === selectionTitle) {
            updatedList.push(selection)
          }
        }
      }
      setSelections(updatedList)
    }
  }
  return (
    <DragDropContext onDragEnd={(result: DropResult) => handleDragEnd(result)}>
      <Droppable droppableId='selectionList'>
        {provided => (
          <List
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ mx: 'auto' }}>
            {selections.map(
              ({ title, width, height, source }: Selection, i: number) => (
                <Draggable draggableId={title} index={i} key={title}>
                  {provided => (
                    <ListItem
                      sx={{
                        bgcolor: 'background.paper',
                        border: 1,
                        display: 'flex',
                        gap: 4,
                        justifyContent: 'space-between',
                        mx: 'auto',
                        textAlign: 'left',
                        '&:not(:last-of-type)': {
                          mb: '-1px',
                        },
                      }}
                      ref={provided.innerRef}
                      {...provided.draggableProps}>
                      <Box
                        {...provided.dragHandleProps}
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          gap: 3,
                          textAlign: 'left',
                        }}>
                        <Typography variant='h5'>
                          {i ? `${i + 1}.` : '🐐'}
                        </Typography>
                        {Boolean(source) ? (
                          <Avatar
                            sx={{
                              height: Number(height) / 4,
                              width: Number(width) / 4,
                              maxWidth: 1 / 4,
                            }}
                            alt={title}
                            src={source}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              height: 60,
                              my: 5,
                              width: 60,
                            }}
                            alt={title}>
                            {getInitials(title)}
                          </Avatar>
                        )}
                        <Typography variant='h6'>
                          {title.split(' (')[0]}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton onClick={() => removeSelection(title)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  )}
                </Draggable>
              )
            )}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default SelectionsList
