import axios from 'axios'

const searchWiki = async (name: string, sport: string) => {
  const { data } = await axios.get(`api/search/sports/${sport}`, {
    params: { name },
  })
  return data
}

export default searchWiki
