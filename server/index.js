const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const dbUrl = "mongodb+srv://admin:funQNuiRUSQPVtF8@cluster0.fnynfqs.mongodb.net/book-store"
mongoose.connect(dbUrl).then((dbo)=>{
    console.log("DB connected")
},(err)=>{
    console.log("error")
});

const app = express()

app.use(cors({ origin: "*" }))
app.use(express.json())

app.get("/", (req, res) => {
    res.send("hello world");

})
app.use("/auth", require("./routes/auth"));
app.listen(8585, () => {
    console.log("start app")
})