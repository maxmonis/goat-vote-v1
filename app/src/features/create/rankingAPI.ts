import axios from "axios"

export const loadRankings = async (params = {}) => {
  return axios.get("/api/rankings", params)
}

export const uploadRanking = async (ranking: any) => {
  return axios.post("/api/rankings", ranking)
}
