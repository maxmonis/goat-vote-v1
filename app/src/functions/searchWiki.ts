import axios from 'axios'

import { SearchParams } from '../interfaces'

const searchWiki = async (searchParams: SearchParams) => {
  const { query, sport, category, timeframe } = searchParams
  const route = `api/search/sports/${sport}`
  const params = { term: query, category, timeframe }
  const { data } = await axios.get(route, { params })
  return data
}

export default searchWiki
