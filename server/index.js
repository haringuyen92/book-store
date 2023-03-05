const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(cors({ origin: "*" }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send("hello");
})

app.listen(6000, () => {
    console.log("start app")
})