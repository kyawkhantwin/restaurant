import React from "react"
import { Routes,Route, Outlet } from "react-router-dom"
import { Home } from "../layout/Home"
import { Order } from "../layout/Order/Order"

import '../style.css'
import { Transaction } from "../layout/Transaction/Transaction"
import { TransactionPrint } from "../layout/Transaction/TransactionPrint"
import { OrderDetail } from "../layout/Order/OrderDetail"
import Login from "../layout/Auth/Login"
import Register from "../layout/Auth/Register"





function App() {
 return(
 
  <Routes>
  <Route path={'/'} element={<Home />} />
  <Route path="/table/:tableId" element={<Order />} />
  <Route path="/order" element={<OrderDetail  />} />
  <Route path="/transaction" element={<Transaction />}/>
  <Route path="/transaction/:id" element={<TransactionPrint />} />

  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />


 
</Routes>

 )
}

export default App
