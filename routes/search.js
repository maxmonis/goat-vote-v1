const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const fetchSportsResults = require('../utilities/fetchSportsResults')

router.get('/sports/:sport', auth, async (req, res) => {
  try {
    const {
      query: { term, timeframe },
      params: { sport },
    } = req
    const results = await fetchSportsResults(term, sport, timeframe)
    res.json(results)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
