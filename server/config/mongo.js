import mongoose from 'mongoose'
import config from './index.js'

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: `${__dirname}/../.env` })

const CONNECTION_URL = process.env.MONGODB_URI

// if you want to run locally, please remove comment below
// const CONNECTION_URL = `mongodb://${config.db.url}/${config.db.name}`

mongoose.set('strictQuery', false)

mongoose.connect(CONNECTION_URL)

mongoose.connection.on('connected', () => {
  console.log('Mongo has connected succesfully')
})
mongoose.connection.on('reconnected', () => {
  console.log('Mongo has reconnected')
})
mongoose.connection.on('error', (error) => {
  console.log('Mongo connection has an error', error)
  mongoose.disconnect()
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongo connection is disconnected')
})
