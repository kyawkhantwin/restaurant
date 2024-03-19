const Shop = require("../models/shopModel.js");
const Product = require("../models/productModel.js");
const Order = require("../models/orderModel.js");
const Transaction = require("../models/transactionModel.js");

const dashboard = async (req, res) => {
  try {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Adjusted to start from 0
    const lastSixMonths = [];

    // Fetch data for the current month
    lastSixMonths.push(`${monthNames[currentMonth]} ${currentYear}`);
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);

    // Initialize an object to store counts for each month
    const monthCounts = {};

    // Fetch shops created in the current month and count them
    const currentMonthShops = await Shop.countDocuments({ createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd } });
    monthCounts[`${monthNames[currentMonth]} ${currentYear}`] = { shops: currentMonthShops };

    // Fetch products created in the current month and count them
    const currentMonthProducts = await Product.countDocuments({ createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd } });
    monthCounts[`${monthNames[currentMonth]} ${currentYear}`].products = currentMonthProducts;

    // Fetch orders created in the current month and count them
    const currentMonthOrders = await Order.countDocuments({ createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd } });
    monthCounts[`${monthNames[currentMonth]} ${currentYear}`].orders = currentMonthOrders;

    // Fetch transactions created in the current month and count them
    const currentMonthTransactions = await Transaction.countDocuments({ createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd } });
    monthCounts[`${monthNames[currentMonth]} ${currentYear}`].transactions = currentMonthTransactions;

    // Fetch data for the past five months
    for (let i = 1; i <= 5; i++) {
      const prevMonthIndex = (currentMonth - i + 12) % 12; // Adjusted to wrap around from December to January
      const prevYear = prevMonthIndex > currentMonth ? currentYear - 1 : currentYear; // Adjusted year if month goes to the previous year
      const prevMonth = monthNames[prevMonthIndex];
      lastSixMonths.unshift(`${prevMonth} ${prevYear}`);

      const monthStart = new Date(prevYear, prevMonthIndex, 1);
      const monthEnd = new Date(prevYear, prevMonthIndex + 1, 0);

      // Fetch shops, products, orders, transactions for each month and count them
      const shopsCount = await Shop.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } });
      const productsCount = await Product.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } });
      const ordersCount = await Order.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } });
      const transactionsCount = await Transaction.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } });

      monthCounts[`${prevMonth} ${prevYear}`] = { shops: shopsCount, products: productsCount, orders: ordersCount, transactions: transactionsCount };
    }

    // Construct an array of data for chart, each object containing month and counts
    const chartData = lastSixMonths.map(month => ({
      month,
      ...(monthCounts[month] || { shops: 0, products: 0, orders: 0, transactions: 0 }) // Default values if no data found
    }));

    const productAll = await Product.find({})

    return res.status(200).json({ message: "Success",data : chartData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = dashboard;
