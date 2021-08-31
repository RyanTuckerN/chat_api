require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 4545
const db = require('./chat-queries/queries')

app.use(express.json())
app.get('/', (request, response) => {
  response.json({ info: 'Our app is up and running' })
})

app.get('/messages', db.getMessages)
app.post('/messages', db.createMessage)

app.listen(port, () => {
  console.log(`App running on ${port}.`)
})