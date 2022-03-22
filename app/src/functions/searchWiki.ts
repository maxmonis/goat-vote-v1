import axios from 'axios'

const searchWiki = async (term: string, sport: string) => {
  const { data } = await axios.get('api/search/sports', {
    params: { term, sport },
  })
  return data
}

export default searchWiki
