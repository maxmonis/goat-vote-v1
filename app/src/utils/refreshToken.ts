import {GoogleLoginResponse} from "react-google-login"
import axios from "axios"

import LocalStorage from "./LocalStorage"

const tokenStorage = new LocalStorage("access-token")

function refreshToken({tokenObj, reloadAuthResponse}: GoogleLoginResponse) {
  setAuthToken(tokenObj.access_token)
  setTimeout(handleRefresh, tokenObj.expires_in * 1000)

  async function handleRefresh() {
    try {
      const authRes = await reloadAuthResponse()
      setAuthToken(authRes.access_token)
      setTimeout(handleRefresh, authRes.expires_in * 1000)
    } catch (error) {
      console.error(error)
      setAuthToken(null)
    }
  }
}

function setAuthToken(token: string | null) {
  if (token) {
    tokenStorage.set(token)
    axios.defaults.headers.common["x-auth-token"] = token
  } else {
    tokenStorage.remove()
    delete axios.defaults.headers.common["x-auth-token"]
  }
}

export default refreshToken
