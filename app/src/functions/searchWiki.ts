import axios from 'axios'

interface SearchParams {
  query: string
  sport: string
  category: string
  timeframe: string
}

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
