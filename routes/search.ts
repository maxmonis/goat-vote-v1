const express = require("express")
const router = express.Router()

const auth = require("../middleware/auth")
const fetchSportsResults = require("../utilities/fetchSportsResults")

import {Request, Response} from "express"

router.get("/sports/:sport", auth, async (req: Request, res: Response) => {
  try {
    const {
      query: {term, timeframe},
      params: {sport},
    } = req
    const results = await fetchSportsResults(term, sport, timeframe)
    res.json(results)
  } catch (error) {
    console.log(error)
    res.status(500).send("Server error")
  }
})

module.exports = router
