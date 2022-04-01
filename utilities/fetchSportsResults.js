const fetchThumbnails = require('./fetchThumbnails')
const fetchPages = require('./fetchPages')
const fetchPageNames = require('./fetchPageNames')

async function fetchSportsResults(term, sport, timeframe) {
  const defaultResult = { options: [], term }
  try {
    const pageNames = await fetchPageNames(term)
    const allPages = await fetchPages(pageNames)
    const validTitles = allPages
      .filter(({ content }) => _isValidOption(content, sport, timeframe))
      .map(({ title }) => title)
    const optionThumbnails = await fetchThumbnails(validTitles)
    const options = validTitles.map(title => ({
      title,
      source:
        optionThumbnails?.find(thumbnailObj => thumbnailObj?.title === title)
          ?.thumbnail?.source || '',
    }))
    return { options, term }
  } catch (error) {
    console.error(error)
    return defaultResult
  }
}

function _isValidOption(content, sport, timeframe) {
  const leagues = {
    baseball: 'MLB',
    basketball: 'NBA',
    football: 'NFL',
  }
  const sportRegex = new RegExp(sport, 'i')
  const leagueRegex = new RegExp(leagues[sport], 'i')
  const descriptionRegex = new RegExp('short description', 'i')
  const contentArr = content.split('\n')
  const description = contentArr.find(str => str.match(descriptionRegex))
  if (!description?.match(sportRegex) && !description?.match(leagueRegex)) {
    return false
  }
  const optionProps = contentArr.filter(str => str[0] === '|')
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
  const debutYear = _extractYear(optionProps, 'debutyear')
  return _isValidTimeframe(timeframe, debutYear)
}

function _isValidBasketballPlayer(optionProps, timeframe) {
  const debutYear =
    _extractYear(optionProps, 'career_start') ||
    _extractYear(optionProps, 'draftyear')
  return _isValidTimeframe(timeframe, debutYear)
}

function _isValidFootballPlayer(optionProps, timeframe) {
  const debutYear =
    _extractYear(optionProps, 'draftyear') ||
    _extractYear(optionProps, 'undraftedyear') ||
    _extractYear(optionProps, 'suppdraftyear')
  return _isValidTimeframe(timeframe, debutYear)
}

function _extractYear(optionProps, propName) {
  const rawVal = _getProp(optionProps, propName)
  return Number(rawVal?.replace(/[^0-9]/g, '')?.slice(0, 4))
}

function _isValidTimeframe(timeframe, debutYear) {
  if (!debutYear) {
    return false
  } else if (['currently', 'all-time'].includes(timeframe)) {
    return true
  }
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
