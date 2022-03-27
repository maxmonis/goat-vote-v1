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
  source: string
  title: string
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
            {selections.map(({ title, source }, i) => (
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
                      <Typography variant='h5'>{i + 1}.</Typography>
                      <Box
                        sx={{ width: { xs: 45, sm: 60 } }}
                        display='flex'
                        justifyContent='center'>
                        {Boolean(source) ? (
                          <Avatar
                            variant='rounded'
                            sx={{
                              height: { xs: 60, sm: 80 },
                              maxWidth: { xs: 45, sm: 60 },
                              width: 'auto',
                            }}
                            alt={title}
                            src={source}
                          />
                        ) : (
                          <Avatar
                            variant='rounded'
                            sx={{
                              height: { xs: 60, sm: 80 },
                              width: { xs: 45, sm: 60 },
                            }}
                            alt={title}>
                            {getInitials(title)}
                          </Avatar>
                        )}
                      </Box>
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
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default SelectionsList
