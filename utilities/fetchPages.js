const axios = require('axios')

const { BASE_URL, BASE_PARAMS } = require('../constants/wikiSearch')

async function fetchPages(titles) {
  if (!titles?.length) {
    return new Promise((_resolve, reject) => reject([]))
  }
  const params = {
    ...BASE_PARAMS,
    rvprop: 'content',
    prop: 'revisions',
    titles: typeof titles === 'string' ? titles : titles.join('|'),
  }
  try {
    const { data } = await axios.get(BASE_URL, { params })
    return Object.values(data?.query?.pages || {})?.map(
      ({ title, revisions }) => ({
        title,
        content: revisions[0]['*'],
      })
    )
  } catch (error) {
    console.error(error)
    return []
  }
}

module.exports = fetchPages
