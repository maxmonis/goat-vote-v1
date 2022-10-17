import {GoogleLoginResponse} from "react-google-login"
import axios from "axios"

import LocalStorageService from "../services/LocalStorageService"

const refreshToken = (googleLoginResponse: GoogleLoginResponse) => {
  const {tokenObj, reloadAuthResponse} = googleLoginResponse
  setAuthtoken(tokenObj.access_token)
  let refreshTiming = (tokenObj.expires_in || 3600 - 5 * 60) * 1000
  const handleRefresh = async () => {
    const newAuthRes = await reloadAuthResponse()
    setAuthtoken(newAuthRes.access_token)
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000
    setTimeout(handleRefresh, refreshTiming)
  }
  setTimeout(handleRefresh, refreshTiming)
}

export default refreshToken

function setAuthtoken(token?: string) {
  const localToken = new LocalStorageService("access_token")
  if (typeof token === "string") {
    localToken.set(token)
    axios.defaults.headers.common["x-auth-token"] = token
  } else {
    localToken.remove()
    delete axios.defaults.headers.common["x-auth-token"]
  }
}
