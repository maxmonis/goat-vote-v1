import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'

import refreshToken from '../../functions/refreshToken'
import LocalStorageService from '../../services/LocalStorageService'

const localToken = new LocalStorageService('access_token')

const initialState: {
  user: {
    profileObj?: GoogleLoginResponse['profileObj']
    tokenObj?: GoogleLoginResponse['tokenObj']
  }
} = {
  user: {},
}

export const selectUser = (state: RootState) => state.auth.user

const isOnlineResponse = (
  res: GoogleLoginResponse | GoogleLoginResponseOffline
): res is GoogleLoginResponse => Boolean(res as GoogleLoginResponse)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<GoogleLoginResponse | GoogleLoginResponseOffline>
    ) => {
      const { payload } = action
      if (isOnlineResponse(payload)) {
        refreshToken(payload)
        const { tokenObj, profileObj } = payload
        state.user = { tokenObj, profileObj }
      } else {
        state = initialState
      }
    },
    resetUser: () => {
      localToken.remove()
      return initialState
    },
  },
})

export const { setUser, resetUser } = authSlice.actions

export default authSlice.reducer
