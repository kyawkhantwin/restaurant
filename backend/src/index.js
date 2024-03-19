const express = require('express');
const mongoose = require('mongoose');
const productsRoute = require('../routes/productsRoute.js')
const orderRoute = require('../routes/orderRoute.js')
const tableRoute = require('../routes/tableRoute.js')
const shopRoute = require('../routes/shopRoute.js')
const loginRoute = require('../routes/loginRoute.js')
const adminRoute = require('../routes/adminRoute.js')
const dashboardRoute = require('../routes/dashboardRoute.js')

const transactionRoute = require('../routes/transactionRoute.js')
const { PORT, mongoDBUrl } = require('./config.js');
const cors = require('cors')
const path = require('path')

const app = express();
app.use(express.json())
app.use(cors());

app.use('/dashboard',dashboardRoute)

app.use('/user',loginRoute)
app.use('/admin',adminRoute)
app.use('/product',productsRoute)
app.use('/order',orderRoute)
app.use('/table',tableRoute)
app.use('/transaction',transactionRoute)
app.use('/shop',shopRoute)
app.use('/src/upload', express.static(path.join(__dirname, 'upload')));


app.get('/',function(req,res){
  return res.status(200).send('Working')
})

mongoose.connect(mongoDBUrl)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is listening at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });