const mongoose = require('mongoose')

const productSheme = new mongoose.Schema({
    name: String,
    price: Number,
    shop: {type: mongoose.Schema.Types.ObjectId,ref: "Shop"},
    description :{type: String, required: false} ,
status:{
        type: String,
        nums: ['Avaiable','Unavaiable'],
        default: 'Avaiable'
    },
    category: String,
    image : String,
   


},{
  timestamps: true
})

const Product = mongoose.model('Product',productSheme);

module.exports = Product;