const mongoose = require("mongoose")

const RankingSchema = mongoose.Schema({
  creatorName: {
    type: String,
    required: true,
  },
  creatorID: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
  },
  timeframe: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  titles: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model("ranking", RankingSchema)

export {}
