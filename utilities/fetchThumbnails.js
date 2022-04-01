const axios = require('axios')

const { BASE_URL, BASE_PARAMS } = require('../constants/wikiSearch')

async function fetchThumbnails(titles, pithumbsize = '200') {
  if (!titles?.length) {
    return new Promise((_resolve, reject) => reject([]))
  }
  const params = {
    ...BASE_PARAMS,
    prop: 'pageimages',
    pithumbsize,
    titles: titles.join('|'),
  }
  try {
    const { data } = await axios.get(BASE_URL, { params })
    return Object.values(data?.query?.pages || {})
  } catch (error) {
    console.error(error)
    return []
  }
}

module.exports = fetchThumbnails
