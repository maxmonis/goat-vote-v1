import axios from 'axios'

export const loadRankings = async () => {
  return axios.get('/api/rankings')
}

export const uploadRanking = async (ranking: any) => {
  return axios.post('/api/rankings', ranking)
}
