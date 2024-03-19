const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  status: {
    type: String,
    enum: ["active", "finished"],
    default: "active",
  },
  totalAmount: { type: String },
  _orderId: { type: String },

},{
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
