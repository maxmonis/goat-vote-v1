import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../../app/store"
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login"

import refreshToken from "../../utils/refreshToken"
import LocalStorage from "../../utils/LocalStorage"

const tokenStorage = new LocalStorage("access-token")

const initialState: {
  user: {
    profileObj?: GoogleLoginResponse["profileObj"]
    tokenObj?: GoogleLoginResponse["tokenObj"]
  }
} = {
  user: {},
}

export const selectUser = (state: RootState) => state.auth.user

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<GoogleLoginResponse | GoogleLoginResponseOffline>
    ) => {
      const {payload} = action
      if (isOnlineResponse(payload)) {
        refreshToken(payload)
        const {tokenObj, profileObj} = payload
        state.user = {
          tokenObj,
          profileObj,
        }
      } else {
        state = initialState
      }
    },
    resetUser: () => {
      tokenStorage.remove()
      return initialState
    },
  },
})

export const {setUser, resetUser} = authSlice.actions

export default authSlice.reducer

function isOnlineResponse(
  action: GoogleLoginResponse | GoogleLoginResponseOffline
): action is GoogleLoginResponse {
  return typeof (action as GoogleLoginResponse).googleId === "string"
}
