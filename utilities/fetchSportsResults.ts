const fetchPageNames = require("./fetchPageNames")
const fetchPages = require("./fetchPages")
const fetchThumbnails = require("./fetchThumbnails")

async function fetchSportsResults(
  term: string,
  sport: "basketball" | "football" | "baseball",
  timeframe: string
) {
  const defaultResult = {options: [], term}
  try {
    const pageNames = await fetchPageNames(term)
    const allPages = await fetchPages(pageNames)
    const validPages = allPages.filter(({content}: {content: string}) =>
      _isValidOption(content, sport, timeframe)
    )
    const validTitles = validPages.map(({title}: {title: string}) => title)
    const optionThumbnails = await fetchThumbnails(validTitles)
    const options = validPages.map(
      ({title, content}: {title: string; content: string}) => {
        const contentArr = content.split("\n")
        const optionProps = contentArr.filter((str) => str[0] === "|")
        return {
          title,
          optionProps,
          source:
            optionThumbnails?.find(
              (thumbnailObj: {title: string}) => thumbnailObj?.title === title
            )?.thumbnail?.source || "",
        }
      }
    )
    return {options, term}
  } catch (error) {
    console.error(error)
    return defaultResult
  }
}

function _isValidOption(
  content: string,
  sport: "basketball" | "football" | "baseball",
  timeframe: string
) {
  const referencePages = {
    baseball: "baseball-ref",
    basketball: "basketball-ref",
    football: "pro-football-ref",
  } as const

  if (!content?.match(new RegExp(referencePages[sport]))) {
    return false
  }

  console.info(content)

  const optionProps = content.split("\n")

  switch (sport) {
    case "baseball":
      return _isValidBaseballPlayer(optionProps, timeframe)
    case "basketball":
      return _isValidBasketballPlayer(optionProps, timeframe)
    case "football":
      return _isValidFootballPlayer(optionProps, timeframe)
  }
}

function _getProp(props: string[], propName: string) {
  const regex = new RegExp(propName, "i")
  return props
    .find((prop) => prop.match(regex))
    ?.split("=")[1]
    ?.trim()
}

function _isValidBaseballPlayer(optionProps: string[], timeframe: string) {
  const debutYear = _extractYear(optionProps, "debutyear")
  const finalYear =
    _extractYear(optionProps, "final2year") ||
    _extractYear(optionProps, "finalyear") ||
    3000
  return _isValidTimeframe(timeframe, debutYear, finalYear)
}

function _isValidBasketballPlayer(optionProps: string[], timeframe: string) {
  const debutYear =
    _extractYear(optionProps, "career_start") ||
    _extractYear(optionProps, "draftyear")
  const finalYear = _extractYear(optionProps, "career_end") || 3000
  return _isValidTimeframe(timeframe, debutYear, finalYear)
}

function _isValidFootballPlayer(optionProps: string[], timeframe: string) {
  const pastTeams = _getProp(optionProps, "pastteams")
  console.info("pastTeams", pastTeams)
  console.info("optionProps", optionProps)
  const debutYear =
    _extractYear(optionProps, "draftyear") ||
    _extractYear(optionProps, "undraftedyear") ||
    _extractYear(optionProps, "suppdraftyear")
  return _isValidTimeframe(timeframe, debutYear)
}

function _extractYear(optionProps: string[], propName: string) {
  const rawVal = _getProp(optionProps, propName)
  return Number(rawVal?.replace(/[^0-9]/g, "")?.slice(0, 4))
}

function _isValidTimeframe(
  timeframe: string,
  debutYear: number,
  finalYear = 3000
) {
  if (!debutYear) {
    return false
  }

  switch (timeframe) {
    case "currently":
      return finalYear === 3000
    case "all-time":
      return true
    case "21st century":
      return debutYear > 1999
    case "20th century":
      return debutYear < 2000
    case "pre-1960":
      return debutYear < 1960
    case "pre-1920":
      return debutYear < 1920
    default:
      const decadeStart = parseInt(timeframe)
      return debutYear < decadeStart + 8 && finalYear > decadeStart + 2
  }
}

module.exports = fetchSportsResults

export {}
