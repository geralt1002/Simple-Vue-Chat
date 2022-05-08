import path from 'path'
import { fileURLToPath } from 'url'

import express, { json, urlencoded } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const port = 3000

const server = createServer(app)

import logger from 'morgan'
import dateFormat from 'dateformat'

const now = new Date()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8080',
    // origin: 'http://YOUR_HOST_IP:8080',
  },
})

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))

import './config/mongo.js'

import Msg from './models/messages.js'

let users = []
let messages = []

Msg.find((err, result) => {
  if (err) throw err

  messages = result
})

io.on('connection', (socket) => {
  socket.emit('initChat', {
    messages: messages,
  })

  socket.username = 'Anonymous'

  //listen on Change Username

  socket.on('enterUsername', (user) => {
    socket.username = user.username
    users.push({ id: socket.id, username: socket.username })
    updateUsernames()
    io.emit('userConnected', socket.username)
    console.log(`${socket.username} user connected`)
  })

  // Update Usernames on client side

  const updateUsernames = () => {
    io.emit('getUsers', users)
  }

  // Listen on New Message

  socket.on('newMessage', (data) => {
    let message = new Msg({
      message: data.message,
      username: socket.username,
      date: dateFormat(now, 'dd-mm-yyyy,  HH:MM'),
      userId: socket.id,
    })

    // Broadcast The New Message

    message.save((err, result) => {
      if (err) throw err

      messages.push(result)
      io.emit('newMessage', result)
    })
  })

  socket.on('isTyping', () => {
    socket.broadcast.emit('isTyping', socket.username)
  })
  socket.on('stopTyping', (data) => {
    socket.broadcast.emit('stopTyping', data)
  })

  socket.on('deleteOne', (data, err) => {
    Msg.deleteOne({ _id: data._id })
    if (err) throw err
  })

  // Disconnect

  socket.on('disconnect', () => {
    io.emit('userDisconnected', socket.username)

    users = users.filter(function (user) {
      return user.id != socket.id
    })

    // Update the users list

    updateUsernames()
    console.log(`${socket.username} has leaved`)
  })
})

// Handle production

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './public/')))
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, './public/', 'index.html'))
  })
}

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
