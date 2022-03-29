const mongoose = require('mongoose')

const RankingSchema = mongoose.Schema({
  creatorName: {
    type: String,
    required: true,
  },
  creatorID: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  timeframe: {
    type: String,
  },
  subcategory: {
    type: String,
    default: [],
  },
  titles: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('ranking', RankingSchema)
