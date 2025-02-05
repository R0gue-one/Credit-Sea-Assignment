require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const uploadRoute = require('./routes/upload.js');
const extractRoute = require('./routes/extract.js');
const retrieveRoute = require('./routes/retrieve.js');


// Setup mongoose connection 
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.send("Backend is Up!");
});

app.use('/upload', uploadRoute);
app.use('/extract', extractRoute);
app.use('/retrieve', retrieveRoute);


app.listen(5000, () => console.log("Server Up on port:5000"));