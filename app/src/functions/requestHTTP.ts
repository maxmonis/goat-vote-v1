const requestHTTP = async (
  endpoint: string,
  { body, headers, method, token, params }: any = {}
) => {
  method = method || (body ? 'POST' : 'GET')
  headers = headers || { 'content-type': 'application/json' }
  token = token || localStorage.getItem('maxWellness_token')
  if (token) headers['x-auth-token'] = token
  const options: any = { method, headers }
  if (body) options.body = JSON.stringify(body)
  if (params) {
    let prefix = '?'
    for (const key in params) {
      endpoint += `${prefix}${key}=${params[key]}`
      prefix = '&'
    }
  }
  try {
    const res = await fetch(endpoint, options)
    if (res.status === 401) localStorage.removeItem('maxWellness_token')
    return res.ok ? res.json() : Promise.reject(new Error(await res.text()))
  } catch (error) {
    return error
  }
}

export default requestHTTP
