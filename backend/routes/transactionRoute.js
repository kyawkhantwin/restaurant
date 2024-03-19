const express = require('express');
const {createTransaction, detailTransaction,getTransactions,updateTransaction,deleteTransaction} = require("../controllers/transactionController.js");
const { bothMiddleware, userMiddleware } = require('../middleware/authMiddleware.js');

const router =  express.Router()




router.get("/",bothMiddleware,getTransactions)
router.get("/:id",bothMiddleware,detailTransaction)
router.post('/',userMiddleware,createTransaction)
// router.put("/:id",updateTransaction)
// router.delete("/:id",deleteTransaction)

module.exports = router 