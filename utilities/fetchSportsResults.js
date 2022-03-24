const axios = require('axios')

const BASE_URL = 'https://en.wikipedia.org/w/api.php'
const BASE_PARAMS = { format: 'json', origin: '*', action: 'query' }

async function fetchSportsResults(term, sport, timeframe) {
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
    if (_isValidOption(description, sport, timeframe)) {
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

function _isValidOption(description, sport, timeframe) {
  const optionProps = description.split('\n').filter(str => str[0] === '|')
  switch (sport) {
    case 'baseball':
      return (
        description.match(/mlb/i) &&
        _isValidBaseballPlayer(optionProps, timeframe)
      )
    case 'basketball':
      return (
        description.match(/nba/i) &&
        _isValidBasketballPlayer(optionProps, timeframe)
      )
    case 'football':
      return (
        description.match(/nfl/i) &&
        _isValidFootballPlayer(optionProps, timeframe)
      )
  }
}

function _getProp(props, propName) {
  return props
    .find(prop => prop?.includes(propName))
    ?.split('=')[1]
    ?.trim()
}

function _isValidBaseballPlayer(optionProps, timeframe) {
  const debutYear = Number(_getProp(optionProps, 'debutyear'))
  if (!debutYear) return false
  return _isValidTimeframe(timeframe, debutYear)
}

function _isValidBasketballPlayer(optionProps, timeframe) {
  let debutYear = Number(_getProp(optionProps, 'career_start'))
  debutYear ||= Number(_getProp(optionProps, 'draftyear'))
  if (!debutYear) return false
  return _isValidTimeframe(timeframe, debutYear)
}

function _isValidFootballPlayer(optionProps, timeframe) {
  let debutYear = Number(_getProp(optionProps, 'draftyear'))
  debutYear ||= Number(_getProp(optionProps, 'career_start'))
  if (!debutYear) return false
  return _isValidTimeframe(timeframe, debutYear)
}

function _isValidTimeframe(timeframe, debutYear) {
  if (timeframe === 'all-time') return true
  const cutoffs = {
    '21st century': { debutedAfter: 1999 },
    '20th century': { debutedBefore: 2000 },
    'pre-1960': { debutedBefore: 1960 },
    'pre-1920': { debutedBefore: 1920 },
  }
  cutoffs[timeframe] ||= _getDecadeCutoffs(timeframe)
  const { debutedBefore, debutedAfter } = cutoffs[timeframe]
  return debutedBefore && debutedAfter
    ? debutYear > debutedAfter && debutYear < debutedBefore
    : debutedBefore
    ? debutYear < debutedBefore
    : debutedAfter
    ? debutYear > debutedAfter
    : true
}

function _getDecadeCutoffs(decadeString) {
  const decade = parseInt(decadeString)
  return { debutedBefore: decade + 10, debutedAfter: decade - 1 }
}

module.exports = fetchSportsResults
