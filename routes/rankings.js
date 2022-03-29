const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const Ranking = require('../models/Ranking')

router.get('/', auth, async (_req, res) => {
  try {
    const rankings = await Ranking.find()
    res.json(rankings)
  } catch (error) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.post('/', auth, async (req, res) => {
  const { creatorID, creatorName, category, timeframe, subcategory, titles } =
    req.body
  try {
    const newRanking = new Ranking({
      creatorID,
      creatorName,
      category,
      timeframe,
      subcategory,
      titles,
    })
    const ranking = await newRanking.save()
    res.json(ranking)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
