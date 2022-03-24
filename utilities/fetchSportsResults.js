const axios = require('axios')

const BASE_URL = 'https://en.wikipedia.org/w/api.php'
const BASE_PARAMS = { format: 'json', origin: '*', action: 'query' }

async function fetchSportsResults(term, sport) {
  const params = {
    ...BASE_PARAMS,
    action: 'opensearch',
    search: term,
  }
  const {
    data: [, results],
  } = await axios.get(BASE_URL, { params })
  const allOptions = await _fetchAllOptions(results.join('|'))
  const optionTitles = allOptions.map(({ title }) => title).join('|')
  const revisionsPages = await _fetchRevisionsPages(optionTitles)
  const options = []
  for (const revisionPage of revisionsPages) {
    const { title, revisions } = revisionPage
    const description = revisions[0]['*']
    if (_isValidOption(description, sport)) {
      const validOption = allOptions.find(option => option.title === title)
      validOption.thumbnail ||= {}
      options.push(validOption)
    }
  }
  return { options, term }
}

async function _fetchAllOptions(titles) {
  const params = {
    ...BASE_PARAMS,
    prop: 'pageimages',
    pithumbsize: '80',
    titles,
  }
  const {
    data: {
      query: { pages },
    },
  } = await axios.get(BASE_URL, { params })
  return Object.values(pages)
}

async function _fetchRevisionsPages(titles) {
  const {
    data: {
      query: { pages },
    },
  } = await axios.get(BASE_URL, {
    params: {
      ...BASE_PARAMS,
      rvprop: 'content',
      prop: 'revisions',
      titles,
    },
  })
  return Object.values(pages)
}

function _isValidOption(description, sport) {
  const shortDescription = description.split('\n')[0]
  const keys = {
    football: ['American football player'],
    baseball: ['baseball player'],
    basketball: ['basketball player'],
  }
  return shortDescription.includes(keys[sport])
}

module.exports = fetchSportsResults
