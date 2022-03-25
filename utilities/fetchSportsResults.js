const axios = require('axios')

const BASE_URL = 'https://en.wikipedia.org/w/api.php'
const BASE_PARAMS = { format: 'json', origin: '*', action: 'query' }

async function fetchSportsResults(term, sport, timeframe) {
  const params = {
    ...BASE_PARAMS,
    action: 'opensearch',
    search: term,
  }
  const { data } = await axios.get(BASE_URL, { params })
  const revisionsPages = await _fetchPages(data[1].join('|'))
  const validTitles = revisionsPages.map(({ title, description }) =>
    _isValidOption(description, sport, timeframe) ? title : null
  )
  const optionThumbnails = await _fetchThumbnails(validTitles.join('|'))
  const options = validTitles.map(title => ({
    title,
    thumbnail:
      optionThumbnails?.find(thumbnailObj => thumbnailObj?.title === title)
        ?.thumbnail || {},
  }))
  return { options, term }
}

async function _fetchPages(titles) {
  const { data } = await axios.get(BASE_URL, {
    params: {
      ...BASE_PARAMS,
      rvprop: 'content',
      prop: 'revisions',
      titles,
    },
  })
  return (
    Object.values(data?.query?.pages || {})?.map(({ title, revisions }) => ({
      title,
      description: revisions[0]['*'],
    })) || []
  )
}

async function _fetchThumbnails(titles) {
  const { data } = await axios.get(BASE_URL, {
    params: {
      ...BASE_PARAMS,
      prop: 'pageimages',
      pithumbsize: '80',
      titles,
    },
  })
  return Object.values(data?.query?.pages || {}) || []
}

function _isValidOption(description, sport, timeframe) {
  const descriptionArr = description.split('\n')
  const descriptionRegex = new RegExp('short description', 'i')
  const sportRegex = new RegExp(sport, 'i')
  const shortDescription = descriptionArr.find(str =>
    str.match(descriptionRegex)
  )
  if (!shortDescription?.match(sportRegex)) return false
  const optionProps = descriptionArr.filter(str => str[0] === '|')
  switch (sport) {
    case 'baseball':
      return _isValidBaseballPlayer(optionProps, timeframe)
    case 'basketball':
      return _isValidBasketballPlayer(optionProps, timeframe)
    case 'football':
      return _isValidFootballPlayer(optionProps, timeframe)
  }
}

function _getProp(props, propName) {
  const regex = new RegExp(propName, 'i')
  return props
    .find(prop => prop?.match(regex))
    ?.split('=')[1]
    ?.trim()
}

function _isValidBaseballPlayer(optionProps, timeframe) {
  const debutYear = Number(_getProp(optionProps, 'debutyear'))
  if (!debutYear) return false
  return _isValidTimeframe(timeframe, debutYear)
}

function _isValidBasketballPlayer(optionProps, timeframe) {
  const debutYear =
    Number(_getProp(optionProps, 'career_start')) ||
    Number(_getProp(optionProps, 'draftyear'))
  if (!debutYear) return false
  return _isValidTimeframe(timeframe, debutYear)
}

function _isValidFootballPlayer(optionProps, timeframe) {
  const debutYear =
    Number(_getProp(optionProps, 'career_start')) ||
    Number(_getProp(optionProps, 'draftyear'))
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
