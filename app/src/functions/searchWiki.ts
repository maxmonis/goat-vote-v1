import axios from 'axios'

import { SearchParams } from '../interfaces'

const searchWiki = async ({
  query,
  sport,
  category,
  timeframe,
}: SearchParams) => {
  const { data } = await axios.get(`api/search/sports/${sport}`, {
    params: { term: query, category, timeframe },
  })
  return data
}

export default searchWiki
