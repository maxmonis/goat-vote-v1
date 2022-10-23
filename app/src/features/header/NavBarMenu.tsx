import Menu, {MenuProps} from "@mui/material/Menu"

type NavBarMenuProps = {
  anchorEl: MenuProps["anchorEl"]
  children: JSX.Element | null | Array<JSX.Element | null>
  onClose: () => void
  horizontal: "left" | "right"
}

const NavBarMenu = ({
  anchorEl,
  children,
  onClose,
  horizontal,
}: NavBarMenuProps) => {
  const menuProps: MenuProps = {
    anchorEl,
    anchorOrigin: {
      horizontal,
      vertical: "bottom",
    },
    id: "menu-appbar",
    keepMounted: true,
    onClose,
    open: Boolean(anchorEl),
    transformOrigin: {
      horizontal,
      vertical: "top",
    },
  }

  return <Menu {...menuProps}>{children}</Menu>
}

export default NavBarMenu
