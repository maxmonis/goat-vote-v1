import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import rankingsReducer from "../features/rankings/rankingSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rankings: rankingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
