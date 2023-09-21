import path from 'path'
import { fileURLToPath } from 'url'

import express, { json, urlencoded } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

import cors from 'cors'
import logger from 'morgan'
import dateFormat from 'dateformat'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: `${__dirname}/.env` })

const app = express()

const server = createServer(app)

const port = process.env.PORT || 3000

const now = new Date()

app.use(cors())
app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
    // if you want to run locally, please remove comment below

    // origin: 'http://localhost:8080',
  },
})

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
