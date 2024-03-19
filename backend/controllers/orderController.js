const ProductOrder = require("../models/productOrderModel.js");
const Order = require("../models/orderModel.js");
const Table = require("../models/tableModel.js");

const createOrder = async function (request, response) {
  try {
    const { shop, orderDetails, table, totalAmount, _orderId } = request.body;

    // Create a new order
    const newOrder = await Order.create({ table, shop, totalAmount, _orderId });

    // Create ProductOrder entries for each product in the order
    const productPromises = orderDetails.map(async (orderDetail) => {
      const productOrderData = {
        product: orderDetail.product,
        shop: shop,
        order: newOrder._id,
        quantity: orderDetail.quantity,
        totalAmount: orderDetail.totalAmount,
      };

      const productOrder = await ProductOrder.create(productOrderData);

      // Populate the 'product' and 'shop' fields for the response
      return ProductOrder.findById(productOrder._id).populate(["product", "shop"]);
    });

    // Wait for all ProductOrder entries to be created and populated
    const productOrders = await Promise.all(productPromises);

    // Update the table status to 'active'
    const tableUpdated = await Table.findByIdAndUpdate(table, { $set: { status: "active" } }, { new: true });

    const query = { table, shop, status: "active" };
    const order = await Order.findOne(query);

    response.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: {
        productOrder: productOrders,
        order: order,
        table: tableUpdated,
      },
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const tableOrders = async function (request, response) {
  try {
    const { tableId } = request.params;
    const { shop } = request.query;
    const status = "active"; // Set the status to 'active'
    const query = { table: tableId, shop, status };

    const orders = await Order.find(query);

    if (orders.length === 0) {
      return response.status(404).json({
        status: "error",
        message: "No Active Orders Yet",
      });
    }

    const combinedData = await Promise.all(
      orders.map(async (order) => {
        const products = await ProductOrder.find({ order: order._id }).populate(["product", "shop"]);
        return { order, products };
      }),
    );

    const orderData = combinedData.map(({ order }) => order);
    const productOrderData = combinedData.map(({ products }) => products);

    return response.status(200).json({
      status: "success",
      message: "Active Orders found",
      data: { order: orderData.flat(), productOrder: productOrderData.flat() },
    });
  } catch (e) {
    console.log(e);
    return response.status(500).json({
      status: "error",
      message: e.message,
    });
  }
};

const shopOrders = async function (request, response) {
    try {
      const { shopId } = request.params;
      const orders = await Order.find({ shop: shopId }).populate("table")
  
      if (!orders || orders.length === 0) {
        return response.status(404).json({
          status: "error",
          message: "No Order Yet",
        });
      }
  
 
      const combinedData = [];
  
      // Use Promise.all to parallelize fetching productOrders for each order
      await Promise.all(
        orders.map(async (order) => {
          const productOrders = await ProductOrder.find({ order: order._id }).populate(["product", "shop"]);
          const combinedObject = {
            order: order.toObject(), // Convert Mongoose document to plain JavaScript object
            productOrders: productOrders,
          };
  
          // Push the combined object into the array
          combinedData.push(combinedObject);
        }),
      );
  
      // Check if any productOrders were found
      const hasNoProductOrder = combinedData.every((entry) => entry.productOrders.length === 0);
  
      if (hasNoProductOrder) {
        return response.status(404).json({
          status: "error",
          message: "No ProductOrder found for the specified Order",
        });
      }
     
  
      return response.status(200).json({
        status: "success",
        message: "ProductOrder found",
        data: { orders: combinedData },
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
  

const getOrders = async function (request, response) {
  try {
    const { id } = request.params;
    const productOrder = await ProductOrder.findById(id).populate(["product", "shop"]);

    if (!productOrder || productOrder.length === 0) {
      return response.status(404).json({
        status: "failed",
        message: "No ProductOrder found",
      });
    }

    return response.status(200).json({
      status: "success",
      message: "Detail ProductOrder",
      data: { productOrder },
    });
  } catch (e) {
    return response.status(400).json({
      message: e.message,
    });
  }
};

const updateOrder = async function (request, response) {
  try {
    const { product, quantity, totalAmount, shop } = request.body;
    const { id } = request.params;

    if (!product || !quantity || !totalAmount || !shop) {
      return response.status(400).json({
        status: "failed",
        message: "Please fill all required fields",
      });
    }

    const productOrder = await ProductOrder.findByIdAndUpdate(id, request.body, { new: true }).populate("product");

    if (!productOrder) {
      return response.status(404).json({
        status: "failed",
        message: "No ProductOrder found",
      });
    }

    return response.status(200).json({
      status: "success",
      message: "ProductOrder updated",
      data: { productOrder },
    });
  } catch (e) {
    return response.status(400).json({
      message: e.message,
    });
  }
};

const deleteOrder = async function (request, response) {
  try {
    const { id } = request.params;
    const productOrder = await ProductOrder.findByIdAndDelete(id, { new: true });

    if (!productOrder) {
      return response.status(404).json({
        status: "failed",
        message: "No product found",
      });
    }

    return response.status(200).json({
      status: "success",
      message: "ProductOrder deleted",
    });
  } catch (e) {
    return response.status(400).json({
      message: e.message,
    });
  }
};

module.exports = { createOrder, getOrders, tableOrders, shopOrders, updateOrder, deleteOrder };
