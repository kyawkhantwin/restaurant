const express = require('express');
const { getProducts, detailProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productsController.js');
const router = express.Router();

const { adminMiddleware } = require('../middleware/authMiddleware.js');
const { multerErrorHandler,upload } = require('../middleware/upload.js'); // Import the multerErrorHandler middleware

router.get('/', getProducts);
router.get('/:id', detailProduct);
router.post('/', upload.single('image'), adminMiddleware, createProduct);
router.put('/:id', upload.single('image'), adminMiddleware, updateProduct);
router.delete('/:id', adminMiddleware, deleteProduct);

// Add the multerErrorHandler middleware to handle Multer-related errors
router.use(multerErrorHandler);

module.exports = router;
