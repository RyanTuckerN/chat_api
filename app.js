require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const socketPort = process.env.SOCKET_PORT || 8000 //socket port!
const port = process.env.PORT || 3000 //express port!
const db = require('./chat-queries/queries')
const { emit } = require('process')
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5500', //whatever port client runs on!
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get('/', (request, response) => {
  response.json({ info: 'Our app is up and running' })
})

app.listen(port, () => {
  console.log(`🚢 App running on Port ${port}. 🚢`)  
})

app.get('/messages', db.getMessages) //displays messages!

app.post('/messages', db.createMessage) //creates new chat message

// THIS FUNCTION SENDS OUT 10 MOST RECENT FROM RECENT TO OLD
const emitMostRecentMessages = () => {
  db.getSocketMessages()
    .then(result=> io.emit('chat message', result))
    .catch(console.error)
}

//CONNECTS, CREATES MESSAGE, AND EMITS TOP 10 MESSAGES
io.on('connection', socket => {
  console.log('a user has connected 🕺')
  socket.on('chat message', msg=>{
    db.createSocketMessage(JSON.parse(msg))
      .then((_) => {
        emitMostRecentMessages()
      })
      .catch(err=>io.emit(err))
  })

  //close event when user disconnects!
  socket.on('disconnect', ()=>{
    console.log('user has disconnected 🙅‍♂️')  
  })
})

server.listen(socketPort, ()=>{
  console.log(`🔧 Listening for chat activity on Port ${socketPort} 🔧`) 
})  