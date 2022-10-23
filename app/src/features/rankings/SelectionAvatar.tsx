import {Avatar} from "@mui/material"
import {getInitials} from "../../utils/helpers"

const SelectionAvatar = ({title, source}: {title: string; source?: string}) => {
  return source ? (
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
  )
}

export default SelectionAvatar
