const express = require('express');
const {createOrder,getOrders,tableOrders,shopOrders,updateOrder,deleteOrder} = require("../controllers/orderController.js");
const { userMiddleware } = require('../middleware/authMiddleware.js');


const router =  express.Router()

router.use(userMiddleware)

router.get("/",getOrders)
router.get("/table/:tableId",tableOrders)
router.get("/shop/:shopId",shopOrders)
router.post('/',createOrder)
router.put("/:id",updateOrder)
router.delete("/:id",deleteOrder)

module.exports = router