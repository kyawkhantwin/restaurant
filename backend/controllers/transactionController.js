const Transaction = require('../models/transactionModel.js');
const Order = require('../models/orderModel.js');
const Table = require('../models/tableModel.js');
const Product= require('../models/productModel.js');
const ProductOrder = require('../models/productOrderModel.js');

const getTransactions = async function (request, response) {
    try {
        const { shop } = request.query;

        // Fetch transactions with order, shop, and table details
        const transactions = await Transaction.find({ 'shop': shop })
            .populate('order')
            .populate('shop')
            .populate('table')
            .sort({ createdAt: -1 });

        if (transactions.length === 0) {
            return response.status(200).json({
                status: 'success',
                message: 'No transactions found',
                data: transactions
            });
        }

        // Create an array to hold combined transaction and productOrder objects
        const combinedData = [];

        // Fetch and group ProductOrders by transaction ID
        for (const transaction of transactions) {
           
            const productOrders = await ProductOrder.find({ 'order' : transaction.order._id }).populate('product').sort({ createdAt: -1 });
            
            // Combine transaction and productOrders into a single object
            const combinedObject = {
                transaction: transaction,  // Convert Mongoose document to plain JavaScript object
                productOrders: productOrders
            };

            // Push the combined object into the array
            combinedData.push(combinedObject);
        }

        return response.status(200).json({
            status: 'success',
            message: 'All transactions with productOrders',
            data: {transactions : combinedData}
        });
    } catch (error) {
        console.error('Error in getTransactions:', error);
        return response.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message
        });
    }
};



const detailTransaction = async function (request,response){

    try {
        const {id} = request.params
        const { shop } = request.query;

        // Fetch transactions with order, shop, and table details
        const transaction = await Transaction.findById(id)
            .populate('order')
            .populate('shop')
            .populate('table');

        if ( !transaction) {
            return response.status(200).json({
                status: 'success',
                message: 'No transactions found',
                data: transaction
            });
        }

        // Create an array to hold combined transaction and productOrder objects
        const combinedData = [];

        // Fetch and group ProductOrders by transaction ID
      
            const productOrders = await ProductOrder.find({ 'order': transaction.order._id }).populate('product');
            
            // Combine transaction and productOrders into a single object
            const combinedObject = {
                transaction: transaction,  // Convert Mongoose document to plain JavaScript object
                productOrders: productOrders}
            

            // Push the combined object into the array
            combinedData.push(combinedObject)
        

        return response.status(200).json({
            status: 'success',
            message: 'All transactions with productOrders',
            data: {transactions : combinedData}
        });
    } catch (error) {
        console.error('Error in getTransactions:', error);
        return response.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message
        });
    }

   
}


const createTransaction = async function (request, response) {
    try {
        const ordersData = request.body.orders;

        if (!ordersData || !Array.isArray(ordersData) || ordersData.length === 0) {
            return response.status(400).json({
                status: 'failed',
                message: 'Invalid or empty orders data',
            });
        }

        const transactions = await Promise.all(
            ordersData.map(async ({ order, startTime, shop, table, totalAmount }) => {
                const createdTransaction = await Transaction.create({
                    order,
                    shop,
                    startTime,
                    table,
                    totalAmount,
                });
                await Order.findByIdAndUpdate(order, { status: 'finished' });
                const tableUpdated = await Table.findByIdAndUpdate(table, { status: 'empty' }, { new: true });

                const query = { table, shop, status: 'active' };
                const orderUpdated = await Order.findOne(query);
                const productOrder = orderUpdated ? await ProductOrder.find({ order: orderUpdated._id }) : [];

                return { order: orderUpdated, productOrder, table: tableUpdated };
            })
        );

        const order = transactions.map(({ order }) => order);
        const productOrder = transactions.map(({ productOrder }) => productOrder);
        const table = transactions.map(({ table }) => table);
        
        return response.status(201).json({
            status: 'success',
            message: 'Transactions created successfully',
            data: { order, productOrder, table },
        });
    } catch (e) {
        console.log(e);
        return response.status(500).send({
            status: 'error',
            message: e.message,
        });
    }
};


const updateTransaction = async function ( request,response){
    try{
        const {order} =  request.body
        const {id} = request.params; 
        const Transaction = await Transaction.findById(id);


        if (!order ) {
            return response.status(400).json({
                status: 'failed',
                message: 'Fill all required the fields'
            });
        }
        if(!Transaction){
            return response.status(404).json({
                status: 'failed',
                message: 'Transaction not found'
            });
        }

        const updateTransaction = await Transaction.findByIdAndUpdate(id,request.body,{new: true}).populate('order')
        
        return response.status(201).json({
            status: 'success',
            message : 'Transaction Updated',
        })

    }catch(e){
        return response.status(201).json({
            'message' : e.message
        })
    }
}

const deleteTransaction = async function (request,response){
    try{
        const {id} = request.params;
        const Transaction = await Transaction.findById(id)

        if(!Transaction){
            return response.status(404).json({
                status: 'failed',
                message : "Transaction Not Found"
            })

        }
        await Transaction.findByIdAndDelete(id)
        return response.status(200).json({
            status : 'success',
            message : "Transaction Deleted"
        })

    }catch(e){
        return response.status(400).json({
            message : e.message
        })
    }
}

module.exports = { getTransactions,detailTransaction, createTransaction, updateTransaction,deleteTransaction };