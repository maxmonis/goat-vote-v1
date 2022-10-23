import axios from "axios"
import {Sport} from "../shared/models"

type SearchParams = {
  category: string
  query: string
  sport: Sport
  timeframe: string
}

async function searchWiki(searchParams: SearchParams) {
  const {query, sport, category, timeframe} = searchParams
  const route = `api/search/sports/${sport}`
  const params = {term: query, category, timeframe}
  const {data} = await axios.get(route, {params})
  return data
}

export default searchWiki
