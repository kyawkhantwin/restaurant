const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    shop : {type:mongoose.Schema.Types.ObjectId,ref:"Shop"},
    order : {type:mongoose.Schema.Types.ObjectId,ref:"Order"},
    quantity : Number ,
    totalAmount : Number,
    

},{
  timestamps: true
})

const ProductOrder = mongoose.model('ProductOrder',orderSchema)

module.exports = ProductOrder;