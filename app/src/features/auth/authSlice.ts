import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

interface User {
  email: string
  familyName: string
  givenName: string
  googleId: string
  imageUrl: string
  name: string
}

const initialUser: User = {
  email: '',
  familyName: '',
  givenName: '',
  googleId: '',
  imageUrl: '',
  name: '',
}

interface AuthState {
  user: User
  status: 'idle' | 'loading' | 'failed'
}

const initialState: AuthState = {
  user: initialUser,
  status: 'idle',
}

// export const checkForToken = () => {
//   const userId = localStorage.getItem('goat-vote_authToken')
//   return typeof userId === 'string' ? JSON.parse(userId) : userId
// }

export const selectUser = (state: RootState) => state.auth.user

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    resetUser: state => {
      state.user = initialUser
    },
  },
})

export const { setUser, resetUser } = authSlice.actions

export default authSlice.reducer
