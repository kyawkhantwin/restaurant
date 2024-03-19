const Product = require('../models/productModel.js');
const {PORT} = require('../src/config.js')

const getProducts = async function (request, response) {
    try {
        const products = await Product.find({}).populate('shop');
        if (products.length === 0) {
            return response.status(200).json({
                status: 'failed',
                message: 'No products found',
                data: products
            });
        }
        return response.status(200).json({
            status: 'success',
            message: 'All products',
            data: {products}
        });
    } catch (e) {
        return response.status(400).send({ message: e.message });
    }
};

const detailProduct = async function (request, response) {
    try {
        const {id} = request.params
        const product = await Product.findById(id).populate('shop');
        if (!product) {
            return response.status(200).json({
                status: 'failed',
                message: 'No products found',
            });
        }
        return response.status(200).json({
            status: 'success',
            message: 'Detail Product',
            data: {product}
        });
    } catch (e) {
        return response.status(400).send({ message: e.message });
    }
};

const createProduct = async function (request, response) {
    try {
        const { name, price, category, shop, description, status } = request.body;

        // Construct the image URL using the correct path
        const image = `${process.env.BASE_URL || 'http://localhost'}:${PORT}/` + request.file.path.replace(/\\/g, '/');

        if (!name || !price || !category || !shop || !image) {
            return response.status(400).json({
                status: 'failed',
                message: 'Fill all the fields'
            });
        }

        const createdProduct = await Product.create({
            name,
            price,
            category,
            shop,
            description,
            status,
            image
        });

        return response.status(201).json({
            status: 'success',
            message: 'Product created successfully',
        });
    } catch (error) {
       

        console.error();
        return response.status(500).json({
            status: 'failed',
            message: error
        });
    }
};

module.exports = {
    createProduct,
    // Add other functions as needed
};


const updateProduct = async function (request, response) {
    try {
        const { name, price, category, shop, description } = request.body;
        const { id } = request.params;
        const product = await Product.findById(id);

        if (!name || !price || !category || !shop ) {
            return response.status(400).json({
                status: 'failed',
                message: 'Fill all required fields',
            });
        }

        if (!product) {
            return response.status(404).json({
                status: 'failed',
                message: 'Product not found',
            });
        }

        let updatedProductData = {
            name,
            price,
            category,
            shop,
            description,
           
        };

      
        if (request.file) {
            const image = `http://localhost:${PORT}/` + request.file.path.replace(/\\/g, '/');
            updatedProductData = { ...updatedProductData, image };
        }
       

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true });

        return response.status(201).json({
            status: 'success',
            message: 'Product updated',
            data: {
                product: updatedProduct,
            },
        });
    } catch (e) {
        return response.status(500).json({
            status: 'failed',
            message: e.message,
        });
    }
};




const deleteProduct = async function (request,response){
    try{
        const {id} = request.params;
        const product = await Product.findById(id)

        if(!product){
            return response.status(404).json({
                status: 'failed',
                message : "Product Not Found"
            })

        }
        await Product.findByIdAndDelete(id)
        const allProduct = await Product.find({})
        return response.status(200).json({
            status : 'success',
            message : "Product Deleted",
            data: {product: allProduct}
        })

    }catch(e){
        return response.status(400).json({
            message : e.message
        })
    }
}

module.exports = { getProducts, createProduct, updateProduct,deleteProduct,detailProduct };