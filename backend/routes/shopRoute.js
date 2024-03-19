const express = require('express');
const { getShops, createShop, updateShop,deleteShop } = require('../controllers/shopController.js');
const { bothMiddleware, adminMiddleware } = require('../middleware/authMiddleware.js');



const router = express.Router();


router.get('/', getShops);

router.post('/', adminMiddleware,createShop);
router.put('/:id',adminMiddleware, updateShop);
router.delete('/:id',adminMiddleware,deleteShop );

module.exports = router;
