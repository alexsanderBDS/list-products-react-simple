const express = require('express')
const data = require('./data')
const cors = require('cors')
const port = 4000 || process.env.PORT

const app = express()

app.use(cors())
app.use(express.json())

app.get("/data", (req, res) => {
    res.json({data})
})
app.get("/", (req, res) => {
    res.send("<div style='display: flex; position: absolute; width: 100%; height: 100%; font-size: 50rm; justify-content: center; align-items: center;'><h1><a href='/data'>Please go to /data to see the datas.</a></h1></div>")
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})