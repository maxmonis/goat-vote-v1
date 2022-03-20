import { GoogleLoginResponse } from 'react-google-login'

import LocalStorageService from '../services/localStorageService'

const refreshToken = ({
  tokenObj,
  reloadAuthResponse,
}: GoogleLoginResponse) => {
  const localStorageService = new LocalStorageService()
  let refreshTiming = (tokenObj.expires_in || 3600 - 5 * 60) * 1000
  const handleRefresh = async () => {
    const newAuthRes = await reloadAuthResponse()
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000
    // saveUserToken(newAuthRes.access_token);  <-- TODO: save new token
    localStorageService.set('authToken', newAuthRes.id_token)
    setTimeout(handleRefresh, refreshTiming)
  }
  setTimeout(handleRefresh, refreshTiming)
}

export default refreshToken
