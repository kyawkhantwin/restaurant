const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema({
    shop:{type: mongoose.Schema.Types.ObjectId,ref: "Shop"},
    number : Number,
    capacity : Number,
    status: {
        type : String,
        enum : ['active', 'empty','reserved'],
        default : "empty"
    },
   

},{
  timestamps: true
})

const Table = mongoose.model('Table',tableSchema)

module.exports = Table