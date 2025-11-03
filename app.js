const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000
app.use(express.static(path.join(__dirname, 'public')))
const server = app.listen(PORT, () => {
  console.log(`chat server on port ${PORT}`)
})
