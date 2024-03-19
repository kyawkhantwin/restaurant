const mongoose = require('mongoose')

const transactionScheme =  new mongoose.Schema({
    order : {type: mongoose.Schema.Types.ObjectId ,ref: "Order"} ,
    productOrder : {type: mongoose.Schema.Types.ObjectId ,ref: "ProductOrder"} ,
    shop : {type: mongoose.Schema.Types.ObjectId ,ref: "Shop"} ,
    table : {type: mongoose.Schema.Types.ObjectId ,ref: "Table"} ,
    endTime: { type: Date, default: Date.now },
    startTime : {type: String},
    totalAmount : {type: String},
 

    
},{
    timestamps: true
  })

const Transaction = mongoose.model('Transaction',transactionScheme)

module.exports = Transaction;