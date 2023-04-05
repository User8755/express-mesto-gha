const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000, BASE_PATH } = process.env;


mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use('/user', require('./routes/users'));

app.listen(PORT, () => {
    console.log(BASE_PATH)
    console.log(PORT)
})