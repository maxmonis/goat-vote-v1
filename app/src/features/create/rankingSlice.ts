import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import {RootState} from "../../app/store"
import {uploadRanking, loadRankings} from "./rankingAPI"

export const selectRankings = (state: RootState) => state.rankings.rankings

const initialState: {rankings: any[]} = {rankings: []}

export const addRanking = createAsyncThunk(
  "ranking/uploadRanking",
  async (ranking: any) => {
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
  async (sport: string) => {
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
