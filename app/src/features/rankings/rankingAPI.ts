import axios from "axios"
import {Ranking} from "../../shared/models"

export const loadRankings = async (params = {}) => {
  return axios.get("/api/rankings", params)
}

export const uploadRanking = async (ranking: Ranking) => {
  return axios.post("/api/rankings", ranking)
}
