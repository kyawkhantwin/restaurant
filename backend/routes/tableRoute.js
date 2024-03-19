const express = require('express');
const {createTable, shopTable,detailTable,getTables,updateTable,deleteTable} = require("../controllers/tableController.js");
const {  adminMiddleware, bothMiddleware } = require('../middleware/authMiddleware.js');
const router =  express.Router()



router.get("/",getTables)
router.get("/shop",shopTable)
router.get("/:id",bothMiddleware,detailTable)
router.post('/',adminMiddleware,createTable)
router.put("/:id",bothMiddleware,updateTable)
router.delete("/:id",adminMiddleware,deleteTable)

module.exports = router