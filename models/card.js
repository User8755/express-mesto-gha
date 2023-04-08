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
    type: String,
    required: true
  },
  likes : {
    type: Array,
  },
  createdAt : {
    type: Date
    
  }
});

// создаём модель и экспортируем её
module.exports = mongoose.model("card", cardSchema);
