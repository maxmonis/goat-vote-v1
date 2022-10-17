const express = require("express")
const router = express.Router()

const auth = require("../middleware/auth")
const Ranking = require("../models/Ranking")

import {Request, Response} from "express"

router.get("/", [], async (req: Request, res: Response) => {
  console.info(req.body)
  try {
    const allRankings = await Ranking.find().sort({date: -1})
    res.json(allRankings)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

router.post("/", auth, async (req: Request, res: Response) => {
  const {creatorID, creatorName, category, timeframe, subcategory, titles} =
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
    const savedRanking = await newRanking.save()
    res.json(savedRanking)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error")
  }
})

module.exports = router
