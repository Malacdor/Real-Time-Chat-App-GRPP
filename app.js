const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000 // server on port 4000  
app.use(express.static(path.join(__dirname, 'public'))) // index.html being public means we need no route
const server = app.listen(PORT, () => {
  console.log(`chat server on port ${PORT}`)
})
