import {ReactElement} from "react"
import {useScrollTrigger, Slide} from "@mui/material"

type HideOnScrollProps = {
  children: ReactElement
  window?: () => Window
}

const HideOnScroll = ({children, window}: HideOnScrollProps) => {
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export default HideOnScroll
