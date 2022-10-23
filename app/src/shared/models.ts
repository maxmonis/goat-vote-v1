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

export interface Selection {
  source: string
  title: string
}

export type Sport = "basketball" | "baseball" | "football"
