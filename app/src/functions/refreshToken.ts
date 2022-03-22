import { GoogleLoginResponse } from 'react-google-login'
import axios from 'axios';

import LocalStorageService from '../services/localStorageService'

const refreshToken = ({
  tokenObj,
  reloadAuthResponse,
}: GoogleLoginResponse) => {
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

function setAuthtoken (token?: string) {
  const localStorageService = new LocalStorageService()
  if (typeof token === 'string') {
    localStorageService.set('access_token', token)
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    localStorageService.remove('access_token')
    delete axios.defaults.headers.common['x-auth-token'];
  }
};