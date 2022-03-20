import axios from 'axios'

const searchWiki = async (query: string, sport: string) => {
  const BASE_URL = 'https://en.wikipedia.org/w/api.php'
  const BASE_PARAMS = { format: 'json', origin: '*', action: 'query' }
  const params = {
    ...BASE_PARAMS,
    action: 'opensearch',
    search: query,
  }
  const {
    data: [, results],
  }: { data: [string, string[]] } = await axios.get(BASE_URL, {
    params,
  })
  const selectionPromises = results.map(result => _fetchSelection(result))
  const allOptions = await Promise.all(selectionPromises)
  const revisionPromises = allOptions.map(({ title }) => _getRevisions(title))
  const revisionsPages = await Promise.all(revisionPromises)
  const options = []
  for (const revisionPage of revisionsPages) {
    const { title, revisions } = revisionPage
    const description = revisions[0]['*']
    if (!title.includes('(') && _isValidOption(description)) {
      const validOption = allOptions.find(option => option.title === title)
      validOption.thumbnail = validOption.thumbnail || {}
      options.push(validOption)
    }
  }
  return { options, query }

  async function _fetchSelection(selectionTitle: string) {
    const titles = selectionTitle.trim().replace(/\s+/g, '_')
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
    }: { data: { query: { pages: { [key: string]: any } } } } = await axios.get(
      BASE_URL,
      { params }
    )
    const pageId = Object.keys(pages)[0]
    return pages[pageId]
  }

  async function _getRevisions(selectionTitle = 'NBA_75th_Anniversary_Team') {
    const titles = selectionTitle.trim().replace(/\s+/g, '_')
    const {
      data: {
        query: { pages },
      },
    }: { data: { query: { pages: { [key: string]: any } } } } = await axios.get(
      BASE_URL,
      {
        params: {
          ...BASE_PARAMS,
          titles,
          rvprop: 'content',
          prop: 'revisions',
        },
      }
    )
    const pageId = Object.keys(pages)[0]
    return pages[pageId]
  }

  function _isValidOption(description: string) {
    return _isAthlete(description) && _isCorrectSport(description)
  }

  function _isAthlete(description: string) {
    const conditions = ['stat1value', 'statvalue1', 'draft_year']
    for (const field of conditions) {
      if (description.includes(field)) {
        return true
      }
    }
    return false
  }

  function _isCorrectSport(description: string) {
    const base = [sport]
    const map = {
      football: ['NFL'],
      baseball: ['MLB'],
      basketball: ['NBA'],
    }
    const extra = map[sport as 'baseball' | 'basketball' | 'football'] || []
    for (const prop of [...base, ...extra]) {
      if (!description.includes(prop)) {
        return false
      }
    }
    return true
  }
}

export default searchWiki
