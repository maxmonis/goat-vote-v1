const express = require('express')
const router = express.Router()
const axios = require('axios')

const auth = require('../middleware/auth')

router.get('/sports', auth, async (req, res) => {
  try {
    const {
      query: { term, sport },
    } = req
    const results = await fetchResults(term, sport)
    res.json(results)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router

async function fetchResults(term, sport) {
  const BASE_URL = 'https://en.wikipedia.org/w/api.php'
  const BASE_PARAMS = { format: 'json', origin: '*', action: 'query' }
  const params = {
    ...BASE_PARAMS,
    action: 'opensearch',
    search: term,
  }
  const {
    data: [, results],
  } = await axios.get(BASE_URL, { params })
  const selectionPromises = results.map(result => _fetchSelection(result))
  const allOptions = await Promise.all(selectionPromises)
  const revisionPromises = allOptions.map(({ title }) => _fetchRevisions(title))
  const revisionsPages = await Promise.all(revisionPromises)
  const options = []
  for (const revisionPage of revisionsPages) {
    const { title, revisions } = revisionPage
    const description = revisions[0]['*']
    if (_isValidOption(description)) {
      const validOption = allOptions.find(option => option.title === title)
      validOption.thumbnail ||= {}
      options.push(validOption)
    }
  }
  return { options, term }

  async function _fetchSelection(selectionTitle) {
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
    } = await axios.get(BASE_URL, { params })
    const pageId = Object.keys(pages)[0]
    return pages[pageId]
  }

  async function _fetchRevisions(selectionTitle) {
    const titles = selectionTitle.trim().replace(/\s+/g, '_')
    const {
      data: {
        query: { pages },
      },
    } = await axios.get(BASE_URL, {
      params: {
        ...BASE_PARAMS,
        titles,
        rvprop: 'content',
        prop: 'revisions',
      },
    })
    const pageId = Object.keys(pages)[0]
    return pages[pageId]
  }

  function _isValidOption(description) {
    return _isAthlete(description) && _isCorrectSport(description)
  }

  function _isAthlete(description) {
    const conditions = ['stat1value', 'statvalue1', 'draft_year']
    for (const field of conditions) {
      if (description.includes(field)) {
        return true
      }
    }
    return false
  }

  function _isCorrectSport(description) {
    const base = [sport]
    const map = {
      football: ['NFL'],
      baseball: ['MLB'],
      basketball: ['NBA'],
    }
    const extra = map[sport] || []
    for (const prop of [...base, ...extra]) {
      if (!description.includes(prop)) {
        return false
      }
    }
    return true
  }
}
