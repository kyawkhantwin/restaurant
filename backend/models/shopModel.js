const mongoose = require('mongoose')

const shopScheme = new mongoose.Schema({
    name: String,
    phone: Number,
    location: String,
    userName:{type: String, unique: true, },
    password : String,
    

},{
  timestamps: true
})

const Shop = mongoose.model('Shop',shopScheme)

module.exports = Shop