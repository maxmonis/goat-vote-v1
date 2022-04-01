const axios = require('axios')

const { BASE_URL, BASE_PARAMS } = require('../constants/wikiSearch')

async function fetchPageNames(search) {
  if (!search?.length) {
    return new Promise((_resolve, reject) => reject([]))
  }
  const params = {
    ...BASE_PARAMS,
    action: 'opensearch',
    search,
  }
  try {
    const { data } = await axios.get(BASE_URL, { params })
    return data[1] || []
  } catch (error) {
    console.error(error)
    return []
  }
}

module.exports = fetchPageNames
