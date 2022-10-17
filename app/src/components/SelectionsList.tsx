import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Typography from "@mui/material/Typography"

import {getInitials} from "../functions/helpers"
import {SelectionsListProps} from "../interfaces"

const SelectionsList = ({selections, setSelections}: SelectionsListProps) => {
  return (
    <DragDropContext onDragEnd={(result: DropResult) => handleDragEnd(result)}>
      <Droppable droppableId="selectionList">
        {({droppableProps, innerRef, placeholder}) => (
          <List ref={innerRef} {...droppableProps} sx={{mx: "auto"}}>
            {selections.map(({title, source}, i) => (
              <Draggable draggableId={title} index={i} key={title}>
                {({draggableProps, dragHandleProps, innerRef}) => (
                  <ListItem
                    sx={{
                      bgcolor: "background.paper",
                      border: 1,
                      display: "flex",
                      gap: 4,
                      justifyContent: "space-between",
                      mx: "auto",
                      textAlign: "left",
                      "&:not(:last-of-type)": {
                        mb: "-1px",
                      },
                    }}
                    ref={innerRef}
                    {...draggableProps}
                  >
                    <Box
                      {...dragHandleProps}
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        gap: 3,
                        textAlign: "left",
                      }}
                    >
                      <Typography variant="h5">{i + 1}.</Typography>
                      <Box
                        display="flex"
                        flexShrink={0}
                        justifyContent="center"
                        sx={{
                          width: {
                            xs: 45,
                            sm: 60,
                          },
                        }}
                      >
                        {source ? (
                          <Avatar
                            alt={title}
                            src={source}
                            sx={{
                              height: {
                                xs: 60,
                                sm: 80,
                              },
                              maxWidth: {
                                xs: 45,
                                sm: 60,
                              },
                              width: "auto",
                            }}
                            variant="rounded"
                          />
                        ) : (
                          <Avatar
                            alt={title}
                            sx={{
                              height: {
                                xs: 40,
                                sm: 50,
                              },
                              my: {
                                xs: 2,
                                sm: 3,
                              },
                              width: {
                                xs: 40,
                                sm: 50,
                              },
                            }}
                            variant="rounded"
                          >
                            {getInitials(title)}
                          </Avatar>
                        )}
                      </Box>
                      <Typography variant="h6">
                        {title.split(" (")[0]}
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
            {placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  )

  function removeSelection(titleToRemove: string) {
    setSelections(selections.filter(({title}) => title !== titleToRemove))
  }

  function handleDragEnd({destination, source, draggableId}: DropResult) {
    if (destination && destination.index !== source.index) {
      const selectionTitles = selections.map(({title}) => title)
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
}

export default SelectionsList
