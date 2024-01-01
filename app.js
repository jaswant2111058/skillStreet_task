require("dotenv").config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();


const restAPI = require('./routes/restAPI/user');
const ejsAPI= require('./routes/ejsAPI/user');





mongoose.set('strictQuery', true)
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));





app.use(
    cors({
        origin: "*",
        exposedHeaders: 'Authorization'
    })
);
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/restapi', restAPI);
app.use('/ejs', ejsAPI);



app.listen(process.env.PORT || '5000', () => {
    console.log(`Server started at port ${process.env.PORT || '5000'}`);
});