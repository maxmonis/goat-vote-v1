import { Dispatch, SetStateAction, ReactElement } from 'react'

export interface EditingListProps {
  selections: Selection[]
  setSelections: Dispatch<SetStateAction<Selection[]>>
  sport: string
  category: string
  timeframe: string
}

export interface HideOnScrollProps {
  window?: () => Window
  children: ReactElement
}

export interface NavBarProps {
  dark: boolean
  toggleDark: () => void
}

export type Options = {
  [key in Sport]: SportOptions
}

export interface Ranking {
  creatorID: string
  creatorName: string
  category: Sport
  timeframe: string
  subcategory: string
  titles: string
}

export interface SavedRanking extends Ranking {
  _id: string
}

export interface SearchParams {
  query: string
  sport: string
  category: string
  timeframe: string
}

export interface Selection {
  source: string
  title: string
}

export interface SelectionsListProps {
  selections: Selection[]
  setSelections: Dispatch<SetStateAction<Selection[]>>
}

export type Sport = 'basketball' | 'baseball' | 'football'

interface SportOptions {
  timeframes: string[]
  categories: string[]
}

export interface UserMenuProps {
  dark: boolean
  toggleDark: () => void
}
