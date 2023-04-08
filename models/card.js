const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link : {
    type: String,
    required: true,
  },
  owner : {
    type: 'ObjectId',
    required: true
  },
  likes : {
    type: Array,
    default: []
  },
  createdAt : {
    type: Date,
    default: Date.now
  }
}, { versionKey: false});

// создаём модель и экспортируем её
module.exports = mongoose.model("card", cardSchema);
