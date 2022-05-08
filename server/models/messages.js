import mongoose from 'mongoose'
const msgSchema = new mongoose.Schema({
  message: String,
  username: String,
  date: String,
  userId: String,
})

const Msg = mongoose.model('msg', msgSchema)

export default Msg
