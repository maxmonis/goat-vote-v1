import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import {Ranking, SavedRanking, Sport} from "../../shared/models"
import {RootState} from "../../app/store"
import {uploadRanking, loadRankings} from "./rankingAPI"

export const selectRankings = (state: RootState) => state.rankings.rankings

const initialState: {rankings: SavedRanking[]} = {rankings: []}

export const addRanking = createAsyncThunk(
  "ranking/uploadRanking",
  async (ranking: Ranking) => {
    const {data} = await uploadRanking(ranking)
    return data
  }
)

export const getAllRankings = createAsyncThunk(
  "ranking/loadRankings",
  async () => {
    const {data} = await loadRankings()
    return data
  }
)

export const getSportRankings = createAsyncThunk(
  "ranking/loadSportRankings",
  async (sport: Sport) => {
    const {data} = await loadRankings({sport})
    return data
  }
)

export const rankingSlice = createSlice({
  name: "rankings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRanking.fulfilled, (state, action) => {
        state.rankings.push(action.payload)
      })
      .addCase(getAllRankings.fulfilled, (state, action) => {
        state.rankings = action.payload
      })
  },
})

export default rankingSlice.reducer
